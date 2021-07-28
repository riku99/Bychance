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
import {setLogin} from '~/stores/sessions';
import {setUser} from '~/stores/user';
import {setPosts} from '~/stores/posts';
import {setTalkRooms} from '~/stores/talkRooms';
import {setTalkRoomMessages} from '~/stores/talkRoomMessages';
import {setFlashes} from '~/stores/flashes';
import {setChatPartners} from '~/stores/chatPartners';
import {setFlashStamps} from '~/stores/flashStamps';
import {useCustomDispatch} from './stores';

const useSuccessfullLoginDispatch = () => {
  const dispatch = useCustomDispatch();

  const loginDispatch = useCallback(
    ({
      user,
      posts,
      rooms,
      messages,
      flashes,
      chatPartners,
      flashStamps,
    }: SuccessfullLoginData) => {
      dispatch(setUser(user));
      dispatch(setPosts(posts));
      dispatch(setTalkRooms(rooms));
      dispatch(setTalkRoomMessages(messages));
      dispatch(setFlashes(flashes));
      dispatch(setChatPartners(chatPartners));
      dispatch(setFlashStamps(flashStamps));
      dispatch(setLogin(true));
    },
    [dispatch],
  );

  return {
    loginDispatch,
  };
};

export const useSessionloginProccess = () => {
  const {dispatch, checkKeychain, addBearer, handleApiError} = useApikit();

  const {loginDispatch} = useSuccessfullLoginDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loginProccess = async () => {
      const credentials = await checkKeychain();
      if (credentials) {
        const {id, token} = credentials;
        try {
          const response = await axios.get<SuccessfullLoginData>(
            `${baseUrl}/sessions/sessionLogin?id=${id}`,
            addBearer(token),
          );

          loginDispatch(response.data);
        } catch (e) {
          handleApiError(e);
        }
      }
      setIsLoading(false);
    };
    loginProccess();
  }, [dispatch, checkKeychain, addBearer, handleApiError, loginDispatch]);

  return {
    isLoading,
  };
};

export const useLineLogin = () => {
  const {addBearer} = useApikit();

  const {loginDispatch} = useSuccessfullLoginDispatch();

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

        loginDispatch(restData);
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
  }, [addBearer, loginDispatch]);

  return {
    lineLogin,
  };
};

export const useSampleLogin = () => {
  const {loginDispatch} = useSuccessfullLoginDispatch();

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
    loginDispatch(data);
  }, [loginDispatch]);

  return {
    sampleLogin,
  };
};

export const useLoginSelect = () => {
  const login = useSelector((state: RootState) => {
    return state.sessionReducer.login;
  });
  return login;
};
