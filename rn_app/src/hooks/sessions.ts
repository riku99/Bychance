import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {default as axios} from 'axios';
import LineLogin from '@xmartlabs/react-native-line';
import * as Keychain from 'react-native-keychain';
import auth from '@react-native-firebase/auth';

import {RootState, persistor} from '~/stores/index';
import {baseUrl} from '~/constants/url';
import {useApikit} from './apikit';
import {useCustomDispatch, useResetDispatch} from './stores';
import {setUser} from '~/stores/user';
import {setLogin} from '~/stores/sessions';
import {setPosts} from '~/stores/posts';
import {setFlashes} from '~/stores/flashes';
import {setSetitngs} from '~/stores/settings';
import {setExperiences} from '~/stores/experiences';
import {
  postRequestToLineLogin,
  getRequestToLoginData,
  deleteRequestToSessions,
} from '~/apis/sessions';
import {LoginData} from '~/apis/sessions/types';
import {getIdToken} from '~/helpers/auth';

export const useLoginDispatch = () => {
  const dispatch = useCustomDispatch();
  const loginDispatch = useCallback(
    (data: LoginData) => {
      const {user, backGroundItem, posts, flashes} = data;
      const {
        display,
        videoEditDescription,
        showReceiveMessage,
        talkRoomMessageReceipt,
        intro,
        tooltipOfUsersDisplayShowed,
        groupsApplicationEnabled,
        ...storedUser
      } = user;
      const settings = {
        display,
        talkRoomMessageReceipt,
        showReceiveMessage,
        groupsApplicationEnabled,
      };

      dispatch(setUser({...storedUser, backGroundItem}));
      dispatch(setPosts(posts));
      dispatch(setFlashes(flashes));
      dispatch(setSetitngs(settings));
      dispatch(
        setExperiences({
          tooltipAboutDisplay: tooltipOfUsersDisplayShowed,
          videoEditDescription,
          intro,
        }),
      );
      dispatch(setLogin(true));
    },
    [dispatch],
  );

  return {
    loginDispatch,
  };
};

export const useLoginData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {loginDispatch} = useLoginDispatch();
  useEffect(() => {
    (async function () {
      try {
        const response = await getRequestToLoginData();
        loginDispatch(response.data);
        console.log('💓 Update Login Data');
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [loginDispatch]);

  return {
    isLoading,
  };
};

export const useLogout = () => {
  const {resetDispatch} = useResetDispatch();
  const logout = useCallback(async () => {
    try {
      await deleteRequestToSessions();
      await persistor.purge(); // ストレージのリセット
      await auth().signOut();
      resetDispatch();
    } catch (e) {}
  }, [resetDispatch]);

  return {
    logout,
  };
};

export const useLogin = () => {
  const login = useSelector((state: RootState) => {
    return state.sessionReducer.login;
  });
  return login;
};
