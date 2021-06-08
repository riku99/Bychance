import {PayloadAction} from '@reduxjs/toolkit';

import {chatPartnersAdapter, ChatPartnersState} from '../chatPartners';
import {UserState} from '../user';
import {RefreshUserThunkPaylaod} from '../../apis/users/refreshUser';
import {FlashesState, FlashesAdapter} from '~/stores/flashes';
import {PostsState, PostsAdapter} from '~/stores/posts';

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
    }
  | {
      slice: 'post';
      state: PostsState;
      adaper: PostsAdapter;
    };

type Action = {
  action: PayloadAction<RefreshUserThunkPaylaod>;
};

// nearbyUsersは定期的に更新されるため、とりあえずrefreshUserで更新が適用されないようになっている
export const refreshUser = (arg: State & Action) => {
  if (arg.action.payload.isMyData) {
    if (arg.slice === 'user') {
      return {
        ...arg.state,
        user: arg.action.payload.user,
      };
    }

    if (arg.slice === 'flash') {
      return arg.adapter.setAll(arg.state, arg.action.payload.flashes);
    }

    if (arg.slice === 'post') {
      return arg.adaper.setAll(arg.state, arg.action.payload.posts);
    }
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
