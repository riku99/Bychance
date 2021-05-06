import React, {useEffect, useState} from 'react';
import {View, StyleSheet, AppState, AppStateStatus} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import FlashMessage from 'react-native-flash-message';

import {AppDispatch, RootState} from '../stores/index';
import {RootStackScreen} from '../screens/Root';
import {Container as Auth} from './pages/Auth/Page';
import {Container as Menu} from './utils/Menu';
import {updateLocationThunk} from '../actions/user/updateLocation';
import {getCurrentPosition} from '../helpers/geolocation/getCurrentPosition';
import {checkKeychain} from '../helpers/credentials/checkKeychain';
import {sessionLoginThunk} from '../actions/session/sessionLogin';
import {useSokcetio} from '~/hooks/socketio/connectionSocket';
import {useRecieveTalkRoomMessage} from '~/hooks/talkRoomMessages/recieveTalkRoomMessage';

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

  const socket = useSokcetio({id});
  useRecieveTalkRoomMessage({socket});

  useEffect(() => {
    const loginProcess = async () => {
      const credentials = await checkKeychain();
      if (credentials) {
        await dispatch(sessionLoginThunk(credentials));
        setLoad(false);
      } else {
        setLoad(false);
      }
    };
    loginProcess();
  }, [dispatch]);

  useEffect(() => {
    if (login) {
      const _handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          const position = await getCurrentPosition();
          dispatch(
            updateLocationThunk({
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
