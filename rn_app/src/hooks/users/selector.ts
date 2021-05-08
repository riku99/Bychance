import {shallowEqual, useSelector} from 'react-redux';

import {RootState} from '~/stores/index';

export const useUserSelect = () => {
  const user = useSelector(
    (state: RootState) => state.userReducer.user,
    shallowEqual,
  );
  return user;
};

export const useSelectTamporarilySavedUserEditData = () => {
  const savedEditData = useSelector((state: RootState) => {
    return state.userReducer.temporarilySavedData;
  }, shallowEqual);
  return savedEditData;
};
