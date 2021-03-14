import {shallowEqual, useSelector} from 'react-redux';

import {RootState} from '../../../stores/index';
import {selectNearbyUser} from '../../../stores/nearbyUsers';
import {selectChatPartner} from '../../../stores/chatPartners';
import {UserPageFrom} from '../../../screens/UserPage';

export const useMyId = () =>
  useSelector((state: RootState) => state.userReducer.user!.id, shallowEqual);

type AnotherUserProps = {
  from?: UserPageFrom;
  userId?: number;
};

export const useAnotherUser = ({from, userId}: AnotherUserProps) =>
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

type UserProps = {
  from?: UserPageFrom;
};

export const useUser = ({from}: UserProps) =>
  useSelector((state: RootState) => {
    if (!from) {
      return state.userReducer.user!;
    }
  }, shallowEqual);
