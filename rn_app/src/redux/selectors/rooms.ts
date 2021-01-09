import {RootState, store} from '../index';
import {roomSelectors} from '../rooms';

export const selectRoom = (n: number) => {
  return roomSelectors.selectById(store.getState().roomsReducer, n);
};

export const selectAllRooms = (state: RootState) => {
  return roomSelectors.selectAll(state.roomsReducer);
};

export const selectMessageIds = (state: RootState, roomId: number) => {
  const room = selectRoom(roomId);
  return room!.messages;
};
