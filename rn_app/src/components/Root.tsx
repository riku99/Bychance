import React, {useEffect, useState} from 'react';
import {View, StyleSheet, AppState, AppStateStatus} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
// 型定義ファイルが存在しないまたは見つけられなかったのでignore
// @ts-ignore
import {createConsumer} from '@rails/actioncable';

import {AppDispatch, RootState} from '../redux/index';
import {RootStackScreen} from '../screens/Root';
import {Container as Auth} from '../containers/auth/Auth';
import {Container as Menu} from '../containers/utils/Menu';
import {updatePositionThunk} from '../actions/users';
import {getCurrentPosition} from '../helpers/gelocation';
import {checkKeychain} from '../helpers/keychain';
import {subsequentLoginThunk} from '../actions/users';
import {recieveMessage} from '../redux/messages';

const consumer = createConsumer('ws://localhost/cable');

// @ts-ignore
// actioncableで必要なので記述
global.addEventListener = () => {};
// @ts-ignore
global.removeEventListener = () => {};

const Root = () => {
  const [load, setLoad] = useState(true);

  const dispatch: AppDispatch = useDispatch();

  const login = useSelector((state: RootState) => {
    return state.sessionReducer.login;
  });

  const id = useSelector((state: RootState) => {
    if (state.userReducer.user) {
      return state.userReducer.user.id;
    }
  });

  const displayedMenu = useSelector((state: RootState) => {
    return state.otherSettingsReducer.displayedMenu;
  });

  useEffect(() => {
    const loginProcess = async () => {
      const keychain = await checkKeychain();
      if (keychain) {
        await dispatch(subsequentLoginThunk(keychain));
        setLoad(false);
      } else {
        setLoad(false);
      }
    };
    loginProcess();
  }, [dispatch]);

  useEffect(() => {
    if (login) {
      consumer.subscriptions.create(
        {channel: 'MessagesChannel', id: id},
        {
          connected: () => {},
          received: (data: any) => {
            dispatch(recieveMessage(data));
          },
        },
      );
    } else {
      consumer.disconnect();
    }
  }, [login, id, dispatch]);

  useEffect(() => {
    if (login) {
      const _handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          const position = await getCurrentPosition();
          dispatch(
            updatePositionThunk({
              lat: position ? position.coords.latitude : null,
              lng: position ? position.coords.longitude : null,
            }),
          );
        }
      };

      AppState.addEventListener('change', _handleAppStateChange);
      return () => {
        AppState.removeEventListener('change', _handleAppStateChange);
      };
    }
  }, [dispatch, login]);

  if (load) {
    return null;
  }

  if (login) {
    return (
      <View style={styles.container}>
        <RootStackScreen />
        {displayedMenu && <Menu />}
        <FlashMessage position="top" />
      </View>
    );
  } else {
    return <Auth />;
  }
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
