import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {useCustomDispatch} from '~/hooks/stores';
import {checkKeychain} from '~/helpers/credentials';
import {sessionLoginThunk} from '~/thunks/session/sessionLogin';
import {RootState} from '~/stores/index';

export const useSessionLoginProcess = () => {
  const dispatch = useCustomDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loginProcess = async () => {
      const credentials = await checkKeychain();
      if (credentials) {
        await dispatch(sessionLoginThunk(credentials));
      }
      setIsLoading(false);
    };
    loginProcess();
  }, [dispatch]);

  return {
    isLoading,
  };
};

export const useLoginSelect = () => {
  const login = useSelector((state: RootState) => {
    return state.sessionReducer.login;
  });
  return login;
};
