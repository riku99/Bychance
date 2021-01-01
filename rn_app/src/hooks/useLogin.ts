import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {firstLoginThunk, subsequentLoginAction} from '../actions/users';
import {AppDispatch} from '../redux/index';
import {checkKeychain} from '../helpers/keychain';

export const useLogin = async () => {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    const login: () => Promise<void> = async () => {
      const keychain = await checkKeychain();
      if (keychain) {
        dispatch(subsequentLoginAction(keychain));
      } else {
        dispatch(firstLoginThunk());
      }
    };
    login();
  }, [dispatch]);
};
