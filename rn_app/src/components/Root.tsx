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

const c = async () => {
  await fetch(
    'https://g-sys.toyo.ac.jp/univision/action/sb/f01/Ussb011711?typeCssToApply=mobile',
  )
    .then((r) => {
      r.json();
    })
    .then((v) => console.log(v))
    .catch((e) => {
      console.log(e);
    });
};
