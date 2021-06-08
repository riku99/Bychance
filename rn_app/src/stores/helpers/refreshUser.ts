import {PayloadAction} from '@reduxjs/toolkit';

import {chatPartnersAdapter, ChatPartnersState} from '../chatPartners';
import {UserState} from '../user';
import {RefreshUserThunkPaylaod} from '../../apis/users/refreshUser';
import {FlashesState, flashesAdapter, FlashesAdapter} from '~/stores/flashes';

type State =
  | {
      slice: 'chatPartners';
      state: ChatPartnersState;
    }
  | {
      slice: 'user';
      state: UserState;
    }
  | {
      slice: 'flash';
      state: FlashesState;
      adapter: FlashesAdapter;
    };

type Action = {
  action: PayloadAction<RefreshUserThunkPaylaod>;
};

export const refreshUser = (arg: State & Action) => {
  console.log(arg.action);
  if (arg.action.payload.isMyData) {
    // if (arg.slice === 'user') {
    //   return {
    //     ...arg.state,
    //     user: arg.action.payload.user,
    //   };
    // }

    if (arg.slice === 'flash') {
      console.log(flashesAdapter);
      return arg.adapter.setAll(arg.state, arg.action.payload.flashes);
    }
  }

  // if (arg.action.payload.isMyData) {
  //   const updatedObj = {
  //     id: arg.action.payload.data.id,
  //     changes: arg.action.payload.data,
  //   };
  //   switch (arg.slice) {
  //     case 'chatPartners':
  //       chatPartnersAdapter.updateOne(arg.state, updatedObj);
  //       break;
  //   }
  // }
};
