import {shallowEqual, useSelector} from 'react-redux';

import {RootState} from '~/stores/index';

export const useUserSelect = () => {
  const user = useSelector(
    (state: RootState) => state.userReducer.user,
    shallowEqual,
  );
  return user;
};
