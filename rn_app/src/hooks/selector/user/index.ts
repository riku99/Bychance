import {shallowEqual, useSelector} from 'react-redux';

import {RootState} from '../../../stores/index';
import {selectNearbyUser} from '../../../stores/nearbyUsers';
import {selectChatPartner} from '../../../stores/chatPartners';
import {UserPageFrom} from '../../../navigations/UserPage';

type AnotherUserProps = {
  from?: UserPageFrom;
  userId?: string;
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
