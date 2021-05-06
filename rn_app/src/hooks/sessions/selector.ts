import {useSelector} from 'react-redux';

import {RootState} from '~/stores/index';

export const useLoginSelect = () => {
  const login = useSelector((state: RootState) => {
    return state.sessionReducer.login;
  });
  return login;
};
