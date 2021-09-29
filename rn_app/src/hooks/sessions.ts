import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {default as axios} from 'axios';
import LineLogin from '@xmartlabs/react-native-line';
import * as Keychain from 'react-native-keychain';

import {RootState} from '~/stores/index';
import {baseUrl} from '~/constants/url';
import {useApikit} from './apikit';
import {useResetDispatch} from './stores';
import {setUser} from '~/stores/user';
import {setLogin} from '~/stores/sessions';
import {setPosts} from '~/stores/posts';
import {setFlashes} from '~/stores/flashes';
import {setSetitngs} from '~/stores/settings';
import {setExperiences} from '~/stores/experiences';
import {postRequestToLineLogin, getRequestToLoginData} from '~/apis/sessions';

export const useSessionloginProccess = () => {
  const {dispatch, handleApiError} = useApikit();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loginProccess = async () => {
      try {
        const response = await getRequestToLoginData();

        const {user, posts, flashes} = response.data;
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

        dispatch(setUser(storedUser));
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
      } catch (e) {
        handleApiError(e);
      } finally {
        setIsLoading(false);
      }
    };
    loginProccess();
  }, [dispatch, handleApiError]);

  return {
    isLoading,
  };
};

export const useLineLogin = () => {
  const {dispatch} = useApikit();

  const lineLogin = useCallback(async () => {
    try {
      const loginResult = await LineLogin.login({
        // @ts-ignore
        scopes: ['openid', 'profile'],
      });
      const idToken = loginResult.accessToken.id_token;
      const nonce = loginResult.IDTokenNonce;

      await axios.post(`${baseUrl}/nonce`, {nonce});

      try {
        // const response = await axios.post<LoginData & {accessToken: string}>(
        //   `${baseUrl}/sessions/line_login`,
        //   {},
        //   addBearer(idToken as string),
        // );
        const response = await postRequestToLineLogin({
          idToken: idToken as string,
        });

        // 成功したらキーチェーンにcredentialsを保存
        await Keychain.resetGenericPassword();
        await Keychain.setGenericPassword(
          String(response.data.user.id),
          response.data.accessToken,
        );

        const {user, posts, flashes} = response.data;
        const {
          display,
          videoEditDescription,
          showReceiveMessage,
          talkRoomMessageReceipt,
          intro,
          ...storedUser
        } = user;
        const settings = {
          display,
          videoEditDescription,
          talkRoomMessageReceipt,
          showReceiveMessage,
          intro,
        };

        dispatch(setUser(storedUser));
        dispatch(setPosts(posts));
        dispatch(setFlashes(flashes));
        dispatch(setSetitngs(settings));
        dispatch(setLogin(true));
      } catch (e) {
        Alert.alert(
          'エラーが発生しました。',
          '申し訳ありませんがやり直してください',
        );
      }
    } catch (e) {
      console.log('lineError');
      // if (e.message === 'User cancelled or interrupted the login process.') {
      // }
    }
  }, [dispatch]);

  return {
    lineLogin,
  };
};

export const useSampleLogin = () => {
  const {dispatch} = useApikit();
  const sampleLogin = useCallback(async () => {
    const response = await axios.get(`${baseUrl}/sampleLogin`);
    await Keychain.resetGenericPassword();
    await Keychain.setGenericPassword(
      String(response.data.user.id),
      response.data.accessToken,
    );

    const {user, posts, flashes} = response.data;
    const {
      display,
      videoEditDescription,
      showReceiveMessage,
      talkRoomMessageReceipt,
      intro,
      ...storedUser
    } = user;
    const settings = {
      display,
      videoEditDescription,
      talkRoomMessageReceipt,
      showReceiveMessage,
      intro,
    };

    dispatch(setUser(storedUser));
    dispatch(setPosts(posts));
    dispatch(setFlashes(flashes));
    dispatch(setSetitngs(settings));
    dispatch(setLogin(true));
  }, [dispatch]);

  return {
    sampleLogin,
  };
};

export const useLogout = () => {
  const {checkKeychain, handleApiError, addBearer} = useApikit();

  const {resetDispatch} = useResetDispatch();

  const logout = useCallback(async () => {
    const credentials = await checkKeychain();

    try {
      await axios.get(
        `${baseUrl}/sessions/logout?id=${credentials?.id}`,
        addBearer(credentials?.token),
      );

      await Keychain.resetGenericPassword(); // ログアウトするからキーチェーンの中身リセット
      resetDispatch();
    } catch (e) {
      handleApiError(e);
    }
  }, [checkKeychain, handleApiError, addBearer, resetDispatch]);

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
