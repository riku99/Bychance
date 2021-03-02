import {PayloadAction} from '@reduxjs/toolkit';

import {nearbyUsersAdapter} from '../../nearbyUsers';
import {chatPartnersAdapter} from '../../chatPartners';

type NearbyUsersState = ReturnType<typeof nearbyUsersAdapter.getInitialState>;
type ChatPartnersAdapter = ReturnType<
  typeof chatPartnersAdapter.getInitialState
>;

export const updateAlreadyViewed = (
  state: NearbyUsersState | ChatPartnersAdapter,
  action: PayloadAction<{userId: number; flashId: number}>,
) => {
  const user = state.entities[action.payload.userId];
  if (user) {
    const viewdId = user.flashes.alreadyViewed.includes(action.payload.flashId);
    if (!viewdId) {
      const f = user.flashes;
      const alreadyAllViewed = f.alreadyViewed.length + 1 === f.entities.length;
      const viewed = f.alreadyViewed;
      return nearbyUsersAdapter.updateOne(state, {
        id: action.payload.userId,
        changes: {
          ...user,
          flashes: {
            ...f,
            alreadyViewed: [...viewed, action.payload.flashId],
            isAllAlreadyViewed: alreadyAllViewed,
          },
        },
      });
    }
  }
};
