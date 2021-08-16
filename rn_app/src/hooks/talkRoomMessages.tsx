import React, {useCallback, useEffect, useState} from 'react';
import {AppState, AppStateStatus, View} from 'react-native';
import {default as axios} from 'axios';
import {RNToasty} from 'react-native-toasty';
import io, {Socket} from 'socket.io-client';
import {showMessage} from 'react-native-flash-message';

import {useApikit} from './apikit';
import {baseUrl, origin} from '~/constants/url';
import {useMyId} from './users';
import {useCustomDispatch} from './stores';
import {UserAvatar} from '~/components/utils/Avatar';
import {
  GetTalkRoomMessagesResponse,
  CreateTalkRoomMessageResponse,
  RecieveTalkRoomMessageWithSocket,
} from '~/types/response/talkRoomMessages';
import {useSelectRoom} from './talkRooms';
import {updateTalkRoom, upsertTalkRoom, selectRoom} from '~/stores/_talkRooms';
import {store} from '~/stores';

export const useCreateReadTalkRoomMessages = ({
  talkRoomId,
}: {
  talkRoomId: number;
}) => {
  const room = useSelectRoom(talkRoomId);
  const ids = room?.unreadMessages.map((d) => d.id);
  const {addBearer, checkKeychain, dispatch} = useApikit();

  const createReadTalkRoomMessages = useCallback(
    async (_ids?: number[]) => {
      try {
        if (_ids && _ids.length) {
          const credentials = await checkKeychain();
          await axios.post(
            `${baseUrl}/talk_rooms/${talkRoomId}/messages/read?id=${credentials?.id}`,
            {
              ids: _ids,
            },
            addBearer(credentials?.token),
          );

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
    [addBearer, checkKeychain, talkRoomId, dispatch],
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
  const {checkKeychain, addBearer, handleApiError, dispatch} = useApikit();

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
      const credentials = await checkKeychain();

      try {
        const response = await axios.post<CreateTalkRoomMessageResponse>(
          `${baseUrl}/talk_rooms/${roomId}/messages?id=${credentials?.id}`,
          {
            text,
            partnerId,
          },
          addBearer(credentials?.token),
        );

        if (response.data.talkRoomPrecence) {
          const {text: _text, userId, id, createdAt} = response.data.message;
          dispatch(
            updateTalkRoom({
              id: roomId,
              changes: {
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
                  name: '',
                  avatar: '',
                },
              },
            }),
          );
        }
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, dispatch],
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
          // dispatch(receiveTalkRoomMessage(data));
          const {message, sender} = data;
          const room = selectRoom(store.getState(), message.roomId);
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
                name: sender.name,
                avatar: sender.avatar,
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
  const {addBearer, checkKeychain, handleApiError, dispatch} = useApikit();
  const [result, setResult] = useState<
    GetTalkRoomMessagesResponse['messages']
  >();

  useEffect(() => {
    const _get = async () => {
      try {
        const credentials = await checkKeychain();
        const response = await axios.get<GetTalkRoomMessagesResponse>(
          `${baseUrl}/talk_rooms/${talkRoomId}/messages?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );

        if (response.data.roomPresence) {
          setResult(response.data.messages);
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
                  name: '',
                  avatar: null,
                },
              },
            }),
          );
        }
      } catch (e) {
        handleApiError(e);
      }
    };
    _get();
  }, [addBearer, checkKeychain, talkRoomId, handleApiError, dispatch]);

  return {
    result,
  };
};
