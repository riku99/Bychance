import {PayloadAction} from '@reduxjs/toolkit';

import {chatPartnersAdapter, ChatPartnersState} from '../../chatPartners';
import {User, UserState} from '../../user';
import {AnotherUser} from '../../types';

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
  action: PayloadAction<
    {isMyData: true; data: User} | {isMyData: false; data: AnotherUser}
  >;
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
