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

export const useUser = ({
  from,
  userId,
}: {
  from?: UserPageFrom;
  userId?: string;
}) => {
  const myId = useMyId();

  const user = useSelector((state: RootState) => {
    if (from && userId) {
      switch (from) {
        case 'nearbyUsers':
          return selectNearbyUser(state, userId);
        case 'chatRoom':
          return selectChatPartner(state, userId);
      }
    } else {
      return state.userReducer.user!;
    }
  }, shallowEqual);

  const isMe = myId === userId;

  return {
    user,
    isMe,
  };
};
