import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {default as axios} from 'axios';
import LineLogin from '@xmartlabs/react-native-line';
import * as Keychain from 'react-native-keychain';

import {RootState} from '~/stores/index';
import {baseUrl} from '~/constants/url';
import {useApikit} from './apikit';
import {useCustomDispatch, useResetDispatch} from './stores';
import {setUser} from '~/stores/user';
import {setLogin} from '~/stores/sessions';
import {setPosts} from '~/stores/posts';
import {setFlashes} from '~/stores/flashes';
import {setSetitngs} from '~/stores/settings';
import {setExperiences} from '~/stores/experiences';
import {postRequestToLineLogin, getRequestToLoginData} from '~/apis/sessions';
import {LoginData} from '~/apis/sessions/types';
import {checkKeychain} from '~/apis/export';

const useLoginDispatch = () => {
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

export const useSessionloginProccess = () => {
  const {handleApiError} = useApikit();
  const [isLoading, setIsLoading] = useState(true);
  const {loginDispatch} = useLoginDispatch();

  useEffect(() => {
    const loginProccess = async () => {
      const cred = await checkKeychain();
      try {
        // 実際のリクエストの際もcredは取得するが、ここに関してはcredが存在しない場合はリクエスト自体起こしたくない。なので「credが存在する場合のみ」実行する
        if (cred) {
          const response = await getRequestToLoginData();
          loginDispatch(response.data);
        }
      } catch (e) {
        handleApiError(e);
      } finally {
        setIsLoading(false);
      }
    };
    loginProccess();
  }, [loginDispatch, handleApiError]);

  return {
    isLoading,
  };
};

export const useLineLogin = () => {
  const {loginDispatch} = useLoginDispatch();

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
        const response = await postRequestToLineLogin({
          idToken: idToken as string,
        });

        // 成功したらキーチェーンにcredentialsを保存
        await Keychain.resetGenericPassword();
        await Keychain.setGenericPassword(
          String(response.data.user.id),
          response.data.accessToken,
        );

        loginDispatch(response.data);
      } catch (e) {
        console.log(e);
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
  }, [loginDispatch]);

  return {
    lineLogin,
  };
};

export const useSampleLogin = () => {
  const {loginDispatch} = useLoginDispatch();
  const sampleLogin = useCallback(async () => {
    const response = await axios.get(`${baseUrl}/sampleLogin`);
    await Keychain.resetGenericPassword();
    await Keychain.setGenericPassword(
      String(response.data.user.id),
      response.data.accessToken,
    );

    loginDispatch(response.data);
  }, [loginDispatch]);

  return {
    sampleLogin,
  };
};

export const useLogout = () => {
  const {handleApiError, addBearer} = useApikit();

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
  }, [handleApiError, addBearer, resetDispatch]);

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
