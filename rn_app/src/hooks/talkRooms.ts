import {shallowEqual, useSelector} from 'react-redux';

import {RootState} from '~/stores';
import {selectAllTalkRooms} from '~/stores/talkRooms';

export const useSelectAllRooms = () => {
  const rooms = useSelector(
    (state: RootState) => selectAllTalkRooms(state),
    shallowEqual,
  );
  return rooms;
};
