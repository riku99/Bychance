import React from 'react';
import {useDispatch} from 'react-redux';

import {AppDispatch} from '../../redux/index';
import {firstLoginThunk} from '../../actions/users';
import {Auth} from '../../components/auth/Auth';
import {sampleLogin} from '../../actions/users';

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
