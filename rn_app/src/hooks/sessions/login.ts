import {useEffect} from 'react';

import {useCustomDispatch} from '~/hooks/stores';
import {checkKeychain} from '~/helpers/credentials';
import {sessionLoginThunk} from '~/thunks/session/sessionLogin';

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
