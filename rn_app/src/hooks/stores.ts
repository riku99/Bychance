import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';

import {AppDispatch} from '~/stores/index';
import {AnyAction} from 'redux';
import {setLogin} from '~/stores/sessions';
import {setUser, resetUser} from '~/stores/user';
import {setFlashes, resetFlashes} from '~/stores/flashes';
import {LoginData} from '~/types/response/session';

// AppDispatchの型付けを毎回やるのめんどいのでカスタムdispatchとして定義
export const useCustomDispatch = () => {
  const dispatch = useDispatch<
    ThunkDispatch<any, any, AnyAction> & AppDispatch
  >();
  return dispatch;
};

export const useSuccessfullLoginDispatch = () => {
  const dispatch = useCustomDispatch();

  const loginDispatch = useCallback(
    ({user, flashes}: LoginData) => {
      dispatch(setUser(user));
      dispatch(setFlashes(flashes));
      dispatch(setLogin(true));
    },
    [dispatch],
  );

  return {
    loginDispatch,
  };
};

export const useResetDispatch = () => {
  const dispatch = useCustomDispatch();

  const resetDispatch = useCallback(() => {
    dispatch(setLogin(false));
    dispatch(resetFlashes());
    dispatch(resetUser());
  }, [dispatch]);

  return {
    resetDispatch,
  };
};
