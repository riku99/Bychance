import {useEffect} from 'react';
import * as Keychain from 'react-native-keychain';
import {useDispatch} from 'react-redux';
import {firstLoginAction, subsequentLoginAction} from '../actions/users_action';

export const useLogin = async () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const login: () => Promise<void> = async () => {
      const credentials = await Keychain.getGenericPassword();
      const id = credentials && credentials.username;
      const token = credentials && credentials.password;
      if (id && token) {
        dispatch(subsequentLoginAction({id: id, token: token}));
      } else {
        dispatch(firstLoginAction());
      }
    };
    login();
  }, [dispatch]);
};
