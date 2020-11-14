import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet, AppState, AppStateStatus} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
// 型定義ファイルが存在しないまたは見つけられなかったのでignore
// @ts-ignore
import {createConsumer} from '@rails/actioncable';

import {useLogin} from '../hooks/useLogin';
import {RootState} from '../redux/index';
import {RootStackScreen} from '../screens/Root';
import {Container as Menu} from '../containers/utils/Menu';
import {updatePositionThunk} from '../actions/users';
import {getCurrentPosition} from '../helpers/gelocation';

const consumer = createConsumer('ws://localhost:80/cable');

const Root = () => {
  useLogin();

  const dispatch = useDispatch();

  const login = useSelector((state: RootState) => {
    return state.userReducer.login;
  });

  const displayedMenu = useSelector((state: RootState) => {
    return state.indexReducer.displayedMenu;
  });

  useMemo(() => {
    if (login) {
      return consumer.subscriptions.create('MessagesChannel', {
        connected: () => {
          console.log('connect');
        },
        received: (data: any) => {
          console.log('receive');
          console.log(data);
        },
      });
    } else {
      consumer.disconnect();
    }
  }, [login]);

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

  if (!login) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <RootStackScreen />
        {displayedMenu && <Menu />}
      </View>
      <FlashMessage position="top" />
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
