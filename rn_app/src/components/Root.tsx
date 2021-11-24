import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import Config from 'react-native-config';

import {Main} from '~/components/Main';
import {useLoginState} from '~/hooks/sessions';
import {useMyId} from '~/hooks/users';
import {AuthStackScreen} from '~/navigations/Auth';
import {useIntro} from '~/hooks/experiences';
import {IntroStackScreen} from '~/navigations/Intro';
import {useHandleErrors} from '~/hooks/errors';

const Root = React.memo(() => {
  const login = useLoginState();
  const id = useMyId();
  const {endOfIntro} = useIntro();
  // エラーをdispatchしたときの処理
  useHandleErrors();

  useEffect(() => {
    console.log('🌍 Env is ' + Config.ENV);
    console.log('⭐️ login is ' + login);
  }, [login, id]);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 100);
  }, []);

  if (!login) {
    return <AuthStackScreen />;
  }

  if (!endOfIntro) {
    return <IntroStackScreen />;
  }

  return <Main />;
});

export default Root;
