import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {useLogin} from '../hooks/useLogin';
import {RootState} from '../redux/index';
import {UserStackScreen} from '../screens/User';
import {deleteInfoAction} from '../redux/post';

const Root = () => {
  const login = useSelector((state: RootState) => {
    return state.userReducer.login;
  });
  const info = useSelector((state: RootState) => {
    return state.postReducer.info;
  });

  const dispatch = useDispatch();

  const deleteInfo = () => {
    dispatch(deleteInfoAction());
  };

  useEffect(() => {
    if (info) {
      setTimeout(deleteInfo, 3000);
    }
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
      {info && (
        <View style={styles.info}>
          <Text style={styles.infoText}>{info}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 30,
    borderRadius: 30,
    opacity: 0.8,
    backgroundColor: '#2089dc',
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  infoText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Root;
