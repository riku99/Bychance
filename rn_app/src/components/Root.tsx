import React from 'react';

import {Main} from '~/components/Main';
import {useLoginSelect} from '~/hooks/sessions';
import {useSessionloginProccess} from '~/hooks/sessions';
import {AuthStackScreen} from '~/navigations/Auth';

const Root = React.memo(() => {
  const login = useLoginSelect();
  const {isLoading} = useSessionloginProccess();

  if (isLoading) {
    return null;
  }

  return <>{login ? <Main /> : <AuthStackScreen />}</>;
});

export default Root;
