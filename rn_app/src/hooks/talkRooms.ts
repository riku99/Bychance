import {useCallback, useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';

import {RootState, store} from '~/stores';
import {useApikit} from './apikit';
import {
  setTalkRooms,
  selectAllTalkRooms,
  selectRoom,
  addTalkRoom,
  removeTalkRoom,
} from '~/stores/_talkRooms';
import {useMyId} from './users';
import {upsertUsers} from '~/stores/_users';
import {
  postRequestToTalkRooms,
  deleteRequestToTalkRooms,
  getRequestToTalkRooms,
} from '~/apis/talkRooms';

export const useCreateTalkRoom = () => {
  const {handleApiError, dispatch} = useApikit();

  const createTalkRoom = useCallback(
    async (partner: {id: string}) => {
      try {
        const response = await postRequestToTalkRooms({id: partner.id});
        const {presence, roomId, timestamp} = response.data;
        const room = selectRoom(store.getState(), roomId);
        // トークルームがサーバー側でも存在しなかった場合(それが初めて作成された場合)、サーバー側では存在するがクライアント側には存在しない場合(作成した相手がメッセージを送っていない場合)はaddOneで新しく追加
        if (!presence || !room) {
          dispatch(
            addTalkRoom({
              id: roomId,
              partner: {
                id: partner.id,
              },
              unreadMessages: [],
              lastMessage: null,
              timestamp,
            }),
          );
        }

        return {
          roomId,
          partner,
        };
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, dispatch],
  );

  return {
    createTalkRoom,
  };
};

export const useDeleteTalkRoom = () => {
  const {handleApiError, toast, dispatch} = useApikit();

  const deleteTalkRoom = useCallback(
    async ({talkRoomId}: {talkRoomId: number}) => {
      try {
        await deleteRequestToTalkRooms({talkRoomId});

        toast?.show('削除しました', {type: 'success'});
        dispatch(removeTalkRoom(talkRoomId));
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, toast, dispatch],
  );

  return {
    deleteTalkRoom,
  };
};

export const useGetTalkRoomData = () => {
  const {dispatch} = useApikit();
  const id = useMyId();

  const getTalkRoomData = useCallback(async () => {
    if (id) {
      try {
        const response = await getRequestToTalkRooms({id});

        const storedData = response.data.map((d) => {
          const partner = d.sender.id === id ? d.recipient : d.sender;
          const timestamp = d.updatedAt;
          const lastMessage = d.lastMessage.length ? d.lastMessage[0] : null;
          const {updatedAt, sender, recipient, ...restData} = d; //eslint-disable-line
          return {
            ...restData,
            partner,
            timestamp,
            lastMessage,
          };
        });

        const _userData = response.data.map((d) => {
          const partner = d.sender.id === id ? d.recipient : d.sender;
          const block = partner.blocked.some((b) => b.blockBy === id);
          const {blocked, ...data} = partner; // eslint-disable-line
          return {
            ...data,
            block,
          };
        });

        dispatch(setTalkRooms(storedData));
        dispatch(upsertUsers(_userData));
      } catch (e) {
        // ログイン後に1回エラー出る場合がある(根本的な原因は不明)。これに対応するためにこの処理ではエラーハンドルしない
        // handleApiError(e);
      }
    }
  }, [id, dispatch]);

  // useEffect(() => {
  //   getTalkRoomData();
  // }, [getTalkRoomData]);

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
    (state: RootState) => selectAllTalkRooms(state),
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
    (state: RootState) => selectAllTalkRooms(state),
    shallowEqual,
  );
  let number: number = 0;
  for (let room of allData) {
    number! += room.unreadMessages.length;
  }
  return number;
};
