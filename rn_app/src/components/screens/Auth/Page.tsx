import React from 'react';

import {lineLoginThunk} from '../../../thunks/session/lineLogin';
import {Auth} from './Auth';
import {sampleLogin} from '../../../thunks/session/sampleLogin';
import {useCustomDispatch} from '~/hooks/stores';

export const Container = () => {
  const dispatch = useCustomDispatch();

  const login = (): void => {
    dispatch(lineLoginThunk());
  };

  const _sampleLogin = () => {
    dispatch(sampleLogin());
  };

  return <Auth login={login} sampleLogin={_sampleLogin} />;
};
