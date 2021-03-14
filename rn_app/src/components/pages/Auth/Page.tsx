import React from 'react';
import {useDispatch} from 'react-redux';

import {AppDispatch} from '../../../stores/index';
import {firstLoginThunk} from '../../../actions/session/firstLogin';
import {Auth} from './Auth';
import {sampleLogin} from '../../../actions/session/sampleLogin';

export const Container = () => {
  const dispatch: AppDispatch = useDispatch();

  const login = (): void => {
    dispatch(firstLoginThunk());
  };

  const _sampleLogin = () => {
    dispatch(sampleLogin());
  };

  return <Auth login={login} sampleLogin={_sampleLogin} />;
};
