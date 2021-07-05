import {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useCustomDispatch} from '~/hooks/stores';
import {checkKeychain} from '~/helpers/credentials';
import {sessionLoginThunk} from '~/thunks/session/sessionLogin';
import {RootState} from '~/stores/index';

type Arg = {
  endSessionLogin: () => void;
};

export const useSessionLoginProcess = ({endSessionLogin}: Arg) => {
  const dispatch = useCustomDispatch();

  useEffect(() => {
    const loginProcess = async () => {
      const credentials = await checkKeychain();
      if (credentials) {
        await dispatch(sessionLoginThunk(credentials));
        endSessionLogin();
      } else {
        endSessionLogin();
      }
    };
    loginProcess();
  }, [dispatch, endSessionLogin]);
};

export const useLoginSelect = () => {
  const login = useSelector((state: RootState) => {
    return state.sessionReducer.login;
  });
  return login;
};
