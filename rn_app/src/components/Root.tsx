import React, {useCallback, useState} from 'react';

import {Main} from '~/components/Main';
import {useLoginSelect} from '~/hooks/sessions/selector';
import {useSessionLoginProcess} from '~/hooks/sessions/login';
import {AuthStackScreen} from '~/navigations/Auth';

const Root = React.memo(() => {
  const [load, setLoad] = useState(true);
  const login = useLoginSelect();
  // const id = useUserSelect()?.id; これフックごと削除する

  const onEndSessionLogin = useCallback(() => setLoad(false), []);
  useSessionLoginProcess({endSessionLogin: onEndSessionLogin});

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
