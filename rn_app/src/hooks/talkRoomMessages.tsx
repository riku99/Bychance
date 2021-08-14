import React, {useCallback, useEffect, useState} from 'react';
import {AppState, AppStateStatus, View} from 'react-native';
import {default as axios} from 'axios';
import {RNToasty} from 'react-native-toasty';
import io, {Socket} from 'socket.io-client';
import {useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';

import {useApikit} from './apikit';
import {baseUrl, origin} from '~/constants/url';
import {TalkRoomMessage} from '~/types/talkRoomMessage';
import {addTalkRoomMessage} from '~/stores/talkRoomMessages';
import {store} from '~/stores';
import {updateTalkRoom, selectRoom} from '~/stores/talkRooms';
import {RootState} from '~/stores';
import {useMyId} from './users';
import {ReceivedMessageData} from '~/stores/types';
import {useCustomDispatch} from './stores';
import {receiveTalkRoomMessage} from '~/stores/talkRoomMessages';
import {UserAvatar} from '~/components/utils/Avatar';

export const useCreateReadTalkRoomMessages = () => {
  const {addBearer, checkKeychain, handleApiError} = useApikit();

  const createReadTalkRoomMessages = useCallback(
    async ({
      roomId,
      unreadNumber,
      partnerId,
    }: {
      roomId: number;
      unreadNumber: number;
      partnerId: string;
    }) => {
      const credentials = await checkKeychain();
      try {
        axios.post(
          `${baseUrl}/readTalkRoomMessages?id=${credentials?.id}`,
          {
            talkRoomId: roomId,
            partnerId,
            unreadNumber,
          },
          addBearer(credentials?.token),
        );
      } catch (e) {
        handleApiError(e);
      }
    },
    [addBearer, checkKeychain, handleApiError],
  );

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
        const response = await axios.post<
          | {
              talkRoomPresence: true;
              message: TalkRoomMessage;
              talkRoomId: number;
            }
          | {
              talkRoomPresence: false;
              talkRoomId: number;
            }
        >(
          `${baseUrl}/talkRoomMessages?id=${credentials?.id}`,
          {
            talkRoomId: roomId,
            text,
            partnerId,
          },
          addBearer(credentials?.token),
        );

        dispatch(addTalkRoomMessage(response.data));

        if (response.data.talkRoomPresence) {
          const {timestamp, id, text: _text} = response.data.message;
          const room = selectRoom(store.getState(), roomId);
          if (room) {
            dispatch(
              updateTalkRoom({
                id: roomId,
                changes: {
                  messages: [id, ...room?.messages],
                  timestamp,
                  latestMessage: _text,
                },
              }),
            );
          }

          return response.data.message;
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
                partner: undefined,
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

const _origin = 'http://localhost:4001';

// active時にソケット通信でメッセージ受け取れるようにセットアップ
export const useSetupTalkRoomMessageSocket = () => {
  const id = useMyId();
  const [socket, setSocket] = useState<Socket>();
  const dispatch = useCustomDispatch();

  if (socket) {
    socket.on('connect', () => {
      console.log('cnne');
    });
  }

  useEffect(() => {
    // active時に毎回サブスクリプションする
    const onActive = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        if (id && !socket) {
          console.log('sw');
          setSocket(io(`${_origin}/talkRoomMessages`, {query: {id}}));
        }
      } else {
        if (socket) {
          socket.disconnect();
          setSocket(undefined);
        }
      }
    };

    AppState.addEventListener('change', onActive);

    return () => {
      AppState.removeEventListener('change', onActive);
    };
  }, [id, dispatch, socket]);
};
