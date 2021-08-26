// import {createSlice} from '@reduxjs/toolkit';

// type InitialState = {
//   displayedMenu?: boolean;
//   creatingPost?: boolean;
//   creatingFlash?: boolean;
// };

// const initialState: InitialState = {
//   displayedMenu: false,
//   creatingPost: false,
//   creatingFlash: false,
// };

// const otherSettingsSlice = createSlice({
//   name: 'settings',
//   initialState,
//   reducers: {
//     displayMenu: (state) => {
//       if (state.displayedMenu === false) {
//         return {
//           ...state,
//           displayedMenu: true,
//         };
//       } else {
//         return {
//           ...state,
//           displayedMenu: false,
//         };
//       }
//     },
//     creatingPost: (state) => {
//       return {
//         ...state,
//         creatingPost: !state.creatingPost,
//       };
//     },
//     creatingFlash: (state) => {
//       return {
//         ...state,
//         creatingFlash: state.creatingFlash ? false : true,
//       };
//     },
//     resetRecievedMessage: (state) => ({
//       ...state,
//       receivedMessage: undefined,
//     }),
//     resetSettings: () => initialState,
//   },
// });

// export const {
//   displayMenu,
//   creatingFlash,
//   creatingPost,
//   resetRecievedMessage,
//   resetSettings,
// } = otherSettingsSlice.actions;

// export const otherSettingsReducer = otherSettingsSlice.reducer;
