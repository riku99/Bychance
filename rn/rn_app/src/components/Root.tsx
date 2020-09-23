import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import {useLogin} from '../hooks/useLogin';
import {RootState} from '../redux/index';
import {UserStackScreen} from '../screens/User';

const Root = () => {
  const login = useSelector((state: RootState) => {
    return state.userReducer.login;
  });

  useLogin();
  if (!login) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <UserStackScreen />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  block: {
    height: 50,
  },
  button: {
    backgroundColor: 'white',
  },
});

export default Root;
