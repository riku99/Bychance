import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';

import {Main} from '~/components/Main';
import {useLogin} from '~/hooks/sessions';
import {useMyId} from '~/hooks/users';
import {useSessionloginProccess} from '~/hooks/sessions';
import {AuthStackScreen} from '~/navigations/Auth';
import {useIntro} from '~/hooks/experiences';
import {IntroStackScreen} from '~/navigations/Intro';
import {useHandleErrors} from '~/hooks/errors';

const Root = React.memo(() => {
  const login = useLogin();
  const id = useMyId();
  const {isLoading} = useSessionloginProccess();
  const {endOfIntro} = useIntro();
  // エラーをdispatchしたときの処理
  useHandleErrors();

  useEffect(() => {
    console.log('⭐️ login is ' + login);
    console.log('my id is ' + id);
  }, [login, id]);

  useEffect(() => {
    if ((login && id) || !isLoading) {
      // 初回ロードが終わった時点でスプラッシュ外す。UIが若干ブレるのでそれ隠すために遅延
      setTimeout(() => {
        SplashScreen.hide();
      }, 100);
    }
  }, [isLoading, login, id]);

  if (isLoading) {
    return null;
  }

  if (!login) {
    return <AuthStackScreen />;
  }

  if (!endOfIntro) {
    return <IntroStackScreen />;
  }

  return <Main />;
});

export default Root;
