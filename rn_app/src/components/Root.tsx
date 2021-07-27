import React from 'react';

import {Main} from '~/components/Main';
import {useLoginSelect} from '~/hooks/sessions';
import {useSessionLoginProcess} from '~/hooks/sessions';
import {AuthStackScreen} from '~/navigations/Auth';

const Root = React.memo(() => {
  const login = useLoginSelect();

  const {isLoading} = useSessionLoginProcess();

  if (isLoading) {
    return null;
  }

  if (login) {
    return <Main />;
  } else {
    return <AuthStackScreen />;
  }
});

export default Root;
