import {useEffect} from 'react';
import * as Keychain from 'react-native-keychain';
import {useDispatch} from 'react-redux';
import {firstLoginThunk, subsequentLoginAction} from '../actions/users_action';
import {AppDispatch} from '../redux/index';

export const useLogin = async () => {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    const login: () => Promise<void> = async () => {
      const credentials = await Keychain.getGenericPassword();
      const id = credentials && credentials.username;
      const token = credentials && credentials.password;
      if (id && token) {
        dispatch(subsequentLoginAction({id: id, token: token}));
      } else {
        dispatch(firstLoginThunk());
      }
    };
    login();
  }, [dispatch]);
};
