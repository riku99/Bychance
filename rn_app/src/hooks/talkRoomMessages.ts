import {useCallback} from 'react';
import {default as axios} from 'axios';
import {RNToasty} from 'react-native-toasty';

import {useApikit} from './apikit';
import {baseUrl} from '~/constants/url';
import {TalkRoomMessage} from '~/types/talkRoomMessage';
import {addTalkRoomMessage} from '~/stores/talkRoomMessages';
import {store} from '~/stores';
import {updateTalkRoom, selectRoom} from '~/stores/talkRooms';

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
