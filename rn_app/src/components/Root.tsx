import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';

import {Main} from '~/components/Main';
import {useLoginSelect} from '~/hooks/sessions';
import {useSessionloginProccess} from '~/hooks/sessions';
import {AuthStackScreen} from '~/navigations/Auth';

const Root = React.memo(() => {
  const login = useLoginSelect();
  const {isLoading} = useSessionloginProccess();

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

  return <>{login ? <Main /> : <AuthStackScreen />}</>;
});

export default Root;
