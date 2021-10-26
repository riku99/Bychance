import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';

import {Main} from '~/components/Main';
import {useLogin} from '~/hooks/sessions';
import {useSessionloginProccess} from '~/hooks/sessions';
import {AuthStackScreen} from '~/navigations/Auth';
import {useIntro} from '~/hooks/experiences';

const Root = React.memo(() => {
  const login = useLogin();
  const {isLoading} = useSessionloginProccess();
  const {endOfIntro} = useIntro();

  useEffect(() => {
    if (!isLoading) {
      // 初回ロードが終わった時点でスプラッシュ外す。UIが若干ブレるのでそれ隠すために遅延
      setTimeout(() => {
        SplashScreen.hide();
      }, 100);
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  if (!login) {
    return <AuthStackScreen />;
  }

  return <>{login ? <Main /> : <AuthStackScreen />}</>;
});

export default Root;
