import {PayloadAction} from '@reduxjs/toolkit';

import {nearbyUsersAdapter} from '../../nearbyUsers';
import {chatPartnersAdapter} from '../../chatPartners';

type NearbyUsersState = ReturnType<typeof nearbyUsersAdapter.getInitialState>;
type ChatPartnersState = ReturnType<typeof chatPartnersAdapter.getInitialState>;

export const updateAlreadyViewed = (
  state: NearbyUsersState | ChatPartnersState,
  action: PayloadAction<{userId: number; flashId: number}>,
  {slice}: {slice: 'nearbyUsers' | 'chatPartners'},
) => {
  const user = state.entities[action.payload.userId];
  if (user) {
    const viewedId = user.flashes.alreadyViewed.includes(
      action.payload.flashId,
    );
    if (!viewedId) {
      const f = user.flashes;
      const alreadyAllViewed = f.alreadyViewed.length + 1 === f.entities.length;
      const viewed = f.alreadyViewed;
      const updateObj = {
        id: action.payload.userId,
        changes: {
          ...user,
          flashes: {
            ...f,
            alreadyViewed: [...viewed, action.payload.flashId],
            isAllAlreadyViewed: alreadyAllViewed,
          },
        },
      };
      switch (slice) {
        case 'chatPartners':
          return chatPartnersAdapter.updateOne(state, updateObj);
        case 'nearbyUsers':
          return nearbyUsersAdapter.updateOne(state, updateObj);
      }
    }
  }
};
