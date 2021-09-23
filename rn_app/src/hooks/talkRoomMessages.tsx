import React, {useCallback, useEffect, useState} from 'react';
import {AppState, AppStateStatus, View} from 'react-native';
import {RNToasty} from 'react-native-toasty';
import io, {Socket} from 'socket.io-client';
import {showMessage} from 'react-native-flash-message';
import useSWR from 'swr';

import {useApikit} from './apikit';
import {origin} from '~/constants/url';
import {useMyId} from './users';
import {useCustomDispatch} from './stores';
import {UserAvatar} from '~/components/utils/Avatar';
import {useSelectRoom} from './talkRooms';
import {updateTalkRoom, upsertTalkRoom, selectRoom} from '~/stores/_talkRooms';
import {store} from '~/stores';
import {upsertUsers} from '~/stores/_users';
import {
  getRequestToTalkRoomMessages,
  postRequestToTalkRoomMessages,
  postRequestToTalkRoomMessagesRead,
} from '~/apis/talkRoomMessages';
import {RecieveTalkRoomMessageWithSocket} from '~/types';

export const useCreateReadTalkRoomMessages = ({
  talkRoomId,
}: {
  talkRoomId: number;
}) => {
  const room = useSelectRoom(talkRoomId);
  const ids = room?.unreadMessages.map((d) => d.id);
  const {dispatch} = useApikit();

  const createReadTalkRoomMessages = useCallback(
    async (_ids?: number[]) => {
      try {
        if (_ids && _ids.length) {
          await postRequestToTalkRoomMessagesRead({talkRoomId, ids: _ids});

          dispatch(
            updateTalkRoom({
              id: talkRoomId,
              changes: {
                unreadMessages: [],
              },
            }),
          );
        }
      } catch (e) {
        // handleApiError(e); メッセージ取得の際のエラーとかぶるのでこっちではトースト出さない
      }
    },
    [talkRoomId, dispatch],
  );

  useEffect(() => {
    // トークルームが初回レンダリングされた時はsotreにある未読データを既読にする
    createReadTalkRoomMessages(ids);
  }, [createReadTalkRoomMessages, ids]);

  return {
    createReadTalkRoomMessages,
  };
};

export const useCreateTalkRoomMessage = () => {
  const {handleApiError, dispatch} = useApikit();

  const createMessage = useCallback(
    async ({
      roomId,
      partnerId,
      text,
    }: {
      roomId: number;
      partnerId: string;
      text: string;
    }) => {
      try {
        const response = await postRequestToTalkRoomMessages({
          roomId,
          partnerId,
          text,
        });

        if (response.data.talkRoomPrecence) {
          const {text: _text, userId, id, createdAt} = response.data.message;
          dispatch(
            updateTalkRoom({
              id: roomId,
              changes: {
                timestamp: createdAt,
                lastMessage: {
                  id,
                  text: _text,
                  userId,
                  createdAt,
                },
              },
            }),
          );

          return response.data;
        } else {
          // talkRoomPresenceがfalse、つまり既にトークルームが相手によって削除されている場合
          RNToasty.Show({
            title: 'メンバーが存在しません',
            position: 'center',
          });

          dispatch(
            updateTalkRoom({
              id: roomId,
              changes: {
                unreadMessages: [],
                partner: {
                  id: '',
                },
              },
            }),
          );
        }
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, dispatch],
  );

  return {
    createMessage,
  };
};

// active時にソケット通信でメッセージ受け取れるようにセットアップ
export const useSetupTalkRoomMessageSocket = () => {
  const id = useMyId();
  const [socket, setSocket] = useState<Socket>();
  const dispatch = useCustomDispatch();

  // 初回レンダリングではonChangeが実行されないのでここでサブスクリプション
  useEffect(() => {
    if (id) {
      setSocket(io(`${origin}/talkRoomMessages`, {query: {id}}));
    }
  }, [id]);

  useEffect(() => {
    if (!id && socket) {
      // @ts-ignore
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(undefined);
    }
  }, [id, socket]);

  useEffect(() => {
    // active時に毎回サブスクリプションする
    const onChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        if (id && !socket) {
          setSocket(io(`${origin}/talkRoomMessages`, {query: {id}}));
        }
      } else {
        if (socket) {
          // @ts-ignore
          socket.removeAllListeners();
          socket.disconnect();
          setSocket(undefined);
        }
      }
    };
    AppState.addEventListener('change', onChange);

    return () => {
      AppState.removeEventListener('change', onChange);
    };
  }, [id, dispatch, socket]);

  useEffect(() => {
    if (socket) {
      socket.on(
        'recieveTalkRoomMessage',
        (data: RecieveTalkRoomMessageWithSocket) => {
          const {message, sender} = data;
          const room = selectRoom(store.getState(), message.roomId);

          // 受け取る側にユーザーデータ追加。これないと「ユーザーが存在しません」になる
          dispatch(
            upsertUsers([
              {
                ...sender,
                block: false,
              },
            ]),
          );

          dispatch(
            upsertTalkRoom({
              id: message.roomId,
              unreadMessages: room
                ? [{id: message.id}, ...room.unreadMessages]
                : [{id: message.id}],
              lastMessage: {
                id: message.id,
                text: message.text,
                userId: message.userId,
                createdAt: message.createdAt,
              },
              timestamp: message.createdAt,
              partner: {
                id: sender.id,
              },
            }),
          );
          if (AppState.currentState === 'active' && data.show) {
            showMessage({
              message: data.sender.name,
              description: data.message.text,
              style: {backgroundColor: '#00163b'},
              titleStyle: {color: 'white', marginLeft: 10},
              textStyle: {color: 'white', marginLeft: 10},
              icon: 'default',
              duration: 2000,
              renderFlashMessageIcon: () => {
                return (
                  <View style={{marginRight: 5}}>
                    <UserAvatar size={40} image={data.sender.avatar} />
                  </View>
                );
              },
            });
          }
        },
      );
    }
  }, [socket, dispatch]);

  // https://socket.io/docs/v3/client-socket-instance/
  // disconnectイベントはサーバーが落ちた時とかに発火される。他にも理由いくつかある。
  // サーバー側からのsocket.disconnect()が起こった時、そしてクライアント側からsocket.disconnect()が起こった時には再接続は自動で行われない。逆に他の理由では行われる
  // クライアント側でdisconectした場合は再接続を試みる必要はないし、現在サーバー側でdisconnectしている場面もないので手動で再接続を試みる必要はない。なのでdisconnectイベントのハンドラはいったん必要ない
  // socket.on('disconnect', (reason) => {});
};

export const useGetMessages = ({talkRoomId}: {talkRoomId: number}) => {
  const {handleApiError, dispatch} = useApikit();
  const fetcher = async () => {
    try {
      const response = await getRequestToTalkRoomMessages({talkRoomId});

      if (response.data.roomPresence) {
        return response.data.messages;
      } else {
        RNToasty.Show({
          title: 'メンバーが存在しません',
          position: 'center',
        });
        dispatch(
          updateTalkRoom({
            id: talkRoomId,
            changes: {
              unreadMessages: [],
              partner: {
                id: '',
              },
            },
          }),
        );
      }
    } catch (e) {
      handleApiError(e);
    }
  };

  const {data} = useSWR(`/talk_rooms/${talkRoomId}/messages`, fetcher);

  return {
    result: data,
  };
};
