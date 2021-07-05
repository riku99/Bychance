import React, {useCallback, useState} from 'react';

import {Main} from '~/components/Main';
import {useLoginSelect} from '~/hooks/sessions';
import {useSessionLoginProcess} from '~/hooks/sessions';
import {AuthStackScreen} from '~/navigations/Auth';

const Root = React.memo(() => {
  const [load, setLoad] = useState(true);
  const login = useLoginSelect();

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
