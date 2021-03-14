import {PayloadAction} from '@reduxjs/toolkit';

import {chatPartnersAdapter, ChatPartnersState} from '../../chatPartners';
import {UserState} from '../../user';
import {RefreshUserThunkPaylaod} from '../../../actions/user/refreshUser';

type State =
  | {
      slice: 'chatPartners';
      state: ChatPartnersState;
    }
  | {
      slice: 'user';
      state: UserState;
    };

type Action = {
  action: PayloadAction<RefreshUserThunkPaylaod>;
};

export const refreshUser = (arg: State & Action) => {
  if (arg.action.payload.isMyData && arg.slice === 'user') {
    return {
      ...arg.state,
      user: arg.action.payload.data,
    };
  } else {
    const updatedObj = {
      id: arg.action.payload.data.id,
      changes: arg.action.payload.data,
    };
    switch (arg.slice) {
      case 'chatPartners':
        chatPartnersAdapter.updateOne(arg.state, updatedObj);
        break;
    }
  }
};
