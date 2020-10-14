import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {useLogin} from '../hooks/useLogin';
import {RootState} from '../redux/index';
import {RootStackScreen} from '../screens/Root';
import {
  deleteInfoAction,
  deleteInvalidAction as deletePostInvalid,
} from '../redux/post';
import {deleteInvalidAction as deleteUserInvalid} from '../redux/user';

const Root = () => {
  useLogin();

  const login = useSelector((state: RootState) => {
    return state.userReducer.login;
  });
  const info = useSelector((state: RootState) => {
    return state.postReducer.info;
  });
  const userInvalid = useSelector((state: RootState) => {
    return state.userReducer.errors && state.userReducer.errors.invalidError;
  });
  const postInvalid = useSelector((state: RootState) => {
    return state.postReducer.errors && state.postReducer.errors.invalidError;
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

  useEffect(() => {
    if (postInvalid || userInvalid) {
      setTimeout(() => {
        dispatch(deleteUserInvalid());
        dispatch(deletePostInvalid());
      }, 3000);
    }
  });

  if (!login) {
    return null;
  }

  return (
    <>
      {!userInvalid && (
        <View style={styles.invalid}>
          <Text style={styles.invalidText}>{userInvalid}</Text>
        </View>
      )}
      {postInvalid && (
        <View style={styles.invalid}>
          <Text style={styles.invalidText}>{postInvalid}</Text>
        </View>
      )}
      <View style={styles.container}>
        <RootStackScreen />
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
  invalid: {
    position: 'absolute',
    top: 80,
    zIndex: 10,
    alignSelf: 'center',
  },
  invalidText: {
    color: 'red',
  },
});

export default Root;
