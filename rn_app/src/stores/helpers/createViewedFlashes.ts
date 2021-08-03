// import {PayloadAction} from '@reduxjs/toolkit';

// import {nearbyUsersAdapter, NearbyUsersState} from '../nearbyUsers';
// import {chatPartnersAdapter, ChatPartnersState} from '../chatPartners';

// export const updateAlreadyViewed = (
//   state: NearbyUsersState | ChatPartnersState,
//   action: PayloadAction<{userId: string; flashId: number}>,
//   {slice}: {slice: 'nearbyUsers' | 'chatPartners'},
// ) => {
//   const user = state.entities[action.payload.userId];
//   if (user) {
//     const viewedId = user.flashes.alreadyViewed.includes(
//       action.payload.flashId,
//     );
//     if (!viewedId) {
//       const f = user.flashes;
//       const alreadyAllViewed = f.alreadyViewed.length + 1 === f.entities.length;
//       const viewed = f.alreadyViewed;
//       const updateObj = {
//         id: action.payload.userId,
//         changes: {
//           ...user,
//           flashes: {
//             ...f,
//             alreadyViewed: [...viewed, action.payload.flashId],
//             isAllAlreadyViewed: alreadyAllViewed,
//           },
//         },
//       };
//       switch (slice) {
//         case 'chatPartners':
//           return chatPartnersAdapter.updateOne(state, updateObj);
//         case 'nearbyUsers':
//           return nearbyUsersAdapter.updateOne(state, updateObj);
//       }
//     }
//   }
// };
