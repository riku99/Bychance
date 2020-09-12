import {useEffect} from 'react';
import * as Keychain from 'react-native-keychain';
import {useDispatch} from 'react-redux';
import {firstLoginAction, subsequentLoginAction} from '../actions/users_action';

export const useLogin = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkAccessToken: () => Promise<string | void> = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.password) {
        return credentials.password;
      }
    };

    const login = async () => {
      const result = await checkAccessToken();
      if (result) {
        dispatch(subsequentLoginAction({keychainToken: result}));
      } else {
        dispatch(firstLoginAction({}));
      }
    };
    login();
  }, [dispatch]);
};

type h = {
  <o extends object, b extends keyof o>(o: o, b: b): void;
};

let get: h = (object, key) => {
  console.log(object, key);
};

get({name: 'riku'}, 'name');
