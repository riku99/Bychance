import {useCallback} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {default as axios} from 'axios';

import {RootState} from '~/stores';
import {selectAllTalkRooms, addTalkRoom, selectRoom} from '~/stores/talkRooms';
import {useApikit} from './apikit';
import {baseUrl} from '~/constants/url';
import {AnotherUser} from '~/types/anotherUser';
import {store} from '~/stores';
import {upsertChatPartner} from '~/stores/chatPartners';

export const useCreateTalkRoom = () => {
  const {checkKeychain, addBearer, handleApiError, dispatch} = useApikit();

  const createTalkRoom = useCallback(
    async ({partner}: {partner: AnotherUser}) => {
      const credentials = await checkKeychain();

      try {
        const response = await axios.post<{
          presence: boolean;
          roomId: number;
          timestamp: string;
        }>(
          `${baseUrl}/talkRooms?id=${credentials?.id}`,
          {partnerId: partner.id},
          addBearer(credentials?.token),
        );

        const {presence, roomId, timestamp} = response.data;
        const room = selectRoom(store.getState(), roomId);
        if (!presence || !room) {
          // トークルームがサーバー側でも存在しなかった場合(それが初めて作成された場合)、サーバー側では存在するがクライアント側には存在しない場合(作成した相手がメッセージを送っていない場合)はaddOneで新しく追加
          dispatch(
            addTalkRoom({
              id: roomId,
              partner: partner.id,
              timestamp,
              messages: [],
              unreadNumber: 0,
              latestMessage: null,
            }),
          );
        }

        if (!presence) {
          dispatch(upsertChatPartner(partner));
        }

        return {
          roomId,
          partner,
        };
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, handleApiError, dispatch, addBearer],
  );

  return {
    createTalkRoom,
  };
};

export const useSelectAllRooms = () => {
  const rooms = useSelector(
    (state: RootState) => selectAllTalkRooms(state),
    shallowEqual,
  );
  return rooms;
};
