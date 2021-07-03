import React, {useCallback, useState} from 'react';

import {Main} from '~/components/Main';
import {useUserSelect} from '~/hooks/users/selector';
import {useLoginSelect} from '~/hooks/sessions/selector';
import {useSessionLoginProcess} from '~/hooks/sessions/login';
import {useBackgroundGeolocation} from '~/hooks/geolocation';
import {useSetupBottomToast} from '~/hooks/bottomToast';
import {AuthStackScreen} from '~/navigations/Auth';

const Root = React.memo(() => {
  const [load, setLoad] = useState(true);
  const login = useLoginSelect();
  // const id = useUserSelect()?.id;

  const onEndSessionLogin = useCallback(() => setLoad(false), []);
  useSessionLoginProcess({endSessionLogin: onEndSessionLogin});

  // 位置情報周り
  useBackgroundGeolocation({login});

  // active時の更新処理
  // useActiveRefresh({login, id});

  // 下から出てくるトーストのセットアップ
  useSetupBottomToast(login);

  if (load) {
    return null;
  }

  if (login) {
    return <Main />;
  } else {
    return <AuthStackScreen />;
  }
});

export default Root;
