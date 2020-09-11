import React, {useEffect, FC} from 'react';
import {View, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {firstLoginAction, subsequentLoginAction} from './redux/user';
import * as Keychain from 'react-native-keychain';

const Root: FC = () => {
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

  return (
    <>
      <View>
        <Text>ok</Text>
      </View>
    </>
  );
};

export default Root;
