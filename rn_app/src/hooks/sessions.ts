import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {useCustomDispatch} from '~/hooks/stores';
import {checkKeychain} from '~/helpers/credentials';
import {sessionLoginThunk} from '~/thunks/session/sessionLogin';
import {RootState} from '~/stores/index';

export const useSessionloginProccess = () => {
  const dispatch = useCustomDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loginProccess = async () => {
      const credentials = await checkKeychain();
      if (credentials) {
        // await dispatch(sessionLoginThunk(credentials));
        try {
        } catch (e) {}
      }
      setIsLoading(false);
    };
    loginProccess();
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
