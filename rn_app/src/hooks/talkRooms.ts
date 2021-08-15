import {useCallback, useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {default as axios} from 'axios';

import {RootState, store} from '~/stores';
import {removeTalkRoom} from '~/stores/talkRooms';
import {useApikit} from './apikit';
import {baseUrl} from '~/constants/url';
import {AnotherUser} from '~/types/anotherUser';
import {upsertChatPartner} from '~/stores/chatPartners';
import {
  setTalkRooms,
  selectAllTalkRooms as _selectAllTalkRoom,
  selectRoom,
  addTalkRoom,
} from '~/stores/_talkRooms';
import {GetTalkRoomDataResponse} from '~/types/response/talkRooms';
import {useMyId} from './users';

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
        // トークルームがサーバー側でも存在しなかった場合(それが初めて作成された場合)、サーバー側では存在するがクライアント側には存在しない場合(作成した相手がメッセージを送っていない場合)はaddOneで新しく追加
        if (!presence || !room) {
          dispatch(
            addTalkRoom({
              id: roomId,
              partner: {
                id: partner.id,
                avatar: partner.avatar,
                name: partner.name,
              },
              unreadMessages: [],
              lastMessage: '',
              timestamp,
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

export const useDeleteTalkRoom = () => {
  const {
    addBearer,
    checkKeychain,
    handleApiError,
    toast,
    dispatch,
  } = useApikit();

  const deleteTalkRoom = useCallback(
    async ({talkRoomId}: {talkRoomId: number}) => {
      const credentials = await checkKeychain();

      try {
        await axios.delete(
          `${baseUrl}/talkRooms/${talkRoomId}?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );

        toast?.show('削除しました', {type: 'success'});

        dispatch(removeTalkRoom(talkRoomId));
        // cahtPartners, talkRoomMessagesは削除このの時点で削除しないが、次回ロードの時には含まれないのでとりあえずそれでいい。
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, toast, dispatch],
  );

  return {
    deleteTalkRoom,
  };
};

export const useGetTalkRoomData = () => {
  const {checkKeychain, addBearer, handleApiError, dispatch} = useApikit();
  const id = useMyId();

  const getTalkRoomData = useCallback(async () => {
    if (id) {
      try {
        const credentials = await checkKeychain();
        const response = await axios.get<GetTalkRoomDataResponse>(
          `${baseUrl}/users/${id}/talk_rooms?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );
        console.log(response.data);

        const storedData = response.data.map((d) => {
          const partner = d.sender.id === id ? d.recipient : d.sender;
          const timestamp = d.updatedAt;
          const lastMessage = d.lastMessage.length ? d.lastMessage[0].text : '';
          const {updatedAt, sender, recipient, ...restData} = d; //eslint-disable-line
          return {
            ...restData,
            partner,
            timestamp,
            lastMessage,
          };
        });

        dispatch(setTalkRooms(storedData));
      } catch (e) {
        handleApiError(e);
      }
    }
  }, [id, checkKeychain, handleApiError, addBearer, dispatch]);

  useEffect(() => {
    getTalkRoomData();
  }, [getTalkRoomData]);

  useEffect(() => {
    const onActive = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        getTalkRoomData();
      }
    };
    AppState.addEventListener('change', onActive);

    return () => {
      AppState.removeEventListener('change', onActive);
    };
  }, [getTalkRoomData]);
};

export const useSelectAllRooms = () => {
  const rooms = useSelector(
    (state: RootState) => _selectAllTalkRoom(state),
    shallowEqual,
  );
  return rooms;
};

export const useSelectRoom = (id: number) => {
  const room = useSelector(
    (state: RootState) => selectRoom(state, id),
    shallowEqual,
  );
  return room;
};

export const useGetUnreadNumber = () => {
  const allData = useSelector(
    (state: RootState) => _selectAllTalkRoom(state),
    shallowEqual,
  );
  let number: number = 0;
  for (let room of allData) {
    number! += room.unreadMessages.length;
  }
  return number;
};
