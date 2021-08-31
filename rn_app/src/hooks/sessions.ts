import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {default as axios} from 'axios';
import LineLogin from '@xmartlabs/react-native-line';
import * as Keychain from 'react-native-keychain';

import {RootState} from '~/stores/index';
import {baseUrl} from '~/constants/url';
import {useApikit} from './apikit';
import {SuccessfullLoginData} from '~/types/login';
import {useResetDispatch} from './stores';
import {LoginData} from '~/types/response/session';
import {setUser} from '~/stores/user';
import {setLogin} from '~/stores/sessions';
import {setPosts} from '~/stores/posts';
import {setFlashes} from '~/stores/flashes';
import {setSetitngs} from '~/stores/settings';

export const useSessionloginProccess = () => {
  const {dispatch, checkKeychain, addBearer, handleApiError} = useApikit();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loginProccess = async () => {
      const credentials = await checkKeychain();
      if (credentials) {
        const {id, token} = credentials;
        try {
          const response = await axios.get<LoginData>(
            `${baseUrl}/login_data?id=${id}`,
            addBearer(token),
          );

          const {user, posts, flashes} = response.data;
          const settings = {
            display: user.display,
            videoEditDescription: user.videoEditDescription,
            talkRoomMessageReceipt: user.talkRoomMessageReceipt,
            showReceiveMessage: user.showReceiveMessage,
          };

          dispatch(setUser(user));
          dispatch(setPosts(posts));
          dispatch(setFlashes(flashes));
          dispatch(setSetitngs(settings));
          dispatch(setLogin(true));
        } catch (e) {
          handleApiError(e);
        }
      }
      setIsLoading(false);
    };
    loginProccess();
  }, [dispatch, checkKeychain, addBearer, handleApiError]);

  return {
    isLoading,
  };
};

export const useLineLogin = () => {
  const {addBearer} = useApikit();

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
        const response = await axios.post<
          SuccessfullLoginData & {accessToken: string}
        >(`${baseUrl}/sessions/lineLogin`, {}, addBearer(idToken as string));

        // 成功したらキーチェーンにcredentialsを保存
        await Keychain.resetGenericPassword();
        await Keychain.setGenericPassword(
          String(response.data.user.id),
          response.data.accessToken,
        );

        const {accessToken, ...restData} = response.data; // eslint-disable-line

        // loginDispatch(restData);
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
  }, [addBearer]);

  return {
    lineLogin,
  };
};

export const useSampleLogin = () => {
  const sampleLogin = useCallback(async () => {
    const response = await axios.get<
      SuccessfullLoginData & {accessToken: string}
    >(`${baseUrl}/sampleLogin`);
    await Keychain.resetGenericPassword();
    await Keychain.setGenericPassword(
      response.data.user.id,
      response.data.accessToken,
    );

    const {accessToken, ...data} = response.data; // eslint-disable-line
  }, []);

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

export const useLoginSelect = () => {
  const login = useSelector((state: RootState) => {
    return state.sessionReducer.login;
  });
  return login;
};
