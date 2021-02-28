import {shallowEqual, useSelector} from 'react-redux';

import {RootState} from '../../../redux/index';
import {selectAnotherUser} from '../../../redux/getUsers';
import {selectChatPartner} from '../../../redux/chatPartners';

export const useMyId = () =>
  useSelector((state: RootState) => state.userReducer.user!.id, shallowEqual);

type AnotherUserProps = {
  from?: 'searchUsers' | 'chatRoom';
  userId?: number;
};

export const useAnotherUser = ({from, userId}: AnotherUserProps) =>
  useSelector((state: RootState) => {
    if (from && userId) {
      switch (from) {
        case 'searchUsers':
          return selectAnotherUser(state, userId);
        case 'chatRoom':
          return selectChatPartner(state, userId);
      }
    }
  }, shallowEqual);

type UserProps = {
  from?: 'searchUsers' | 'chatRoom';
};

export const useUser = ({from}: UserProps) =>
  useSelector((state: RootState) => {
    if (!from) {
      return state.userReducer.user!;
    }
  }, shallowEqual);
