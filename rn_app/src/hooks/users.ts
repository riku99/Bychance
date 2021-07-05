import {shallowEqual, useSelector} from 'react-redux';

import {RootState} from '~/stores/index';
import {UserPageFrom} from '~/navigations/UserPage';
import {selectChatPartner} from '~/stores/chatPartners';
import {selectNearbyUser} from '~/stores/nearbyUsers';

export const useSelectTamporarilySavedUserEditData = () => {
  const savedEditData = useSelector((state: RootState) => {
    return state.userReducer.temporarilySavedData;
  }, shallowEqual);
  return savedEditData;
};

export const useMyId = () =>
  useSelector((state: RootState) => state.userReducer.user!.id);

export const useAnotherUser = ({
  from,
  userId,
}: {
  from?: UserPageFrom;
  userId?: string;
}) =>
  useSelector((state: RootState) => {
    if (from && userId) {
      switch (from) {
        case 'nearbyUsers':
          return selectNearbyUser(state, userId);
        case 'chatRoom':
          return selectChatPartner(state, userId);
      }
    }
  }, shallowEqual);

// ユーザーページのように自分のデータか他のユーザーのデータが必要となる時に使う
export const useUser = ({
  from,
  userId,
}: {
  from?: UserPageFrom;
  userId?: string;
}) => {
  const myId = useMyId();
  // userIdが存在しない(Tabから呼び出された)またはuserIdがmyIdと同じ(stackから自分のデータを渡して呼び出した)場合はtrue
  const isMe = !userId || myId === userId;

  const me = useSelector((state: RootState) => {
    if (isMe) {
      return state.userReducer.user!;
    }
  }, shallowEqual);

  const anotherUser = useAnotherUser({from, userId});

  // meとanotherUserで共通して使えるものについてはわざわざmeであるかanotherUserであるか検証したくないのでuserとしてまとめる
  // 別々のものとして使いたい時はme, anotherUserのどちらかを使う
  if (isMe) {
    return {
      user: me,
      me,
      isMe,
    };
  } else {
    return {
      user: anotherUser,
      anotherUser,
      isMe,
    };
  }
};
