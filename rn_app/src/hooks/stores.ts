import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';

import {AppDispatch} from '~/stores/index';
import {AnyAction} from 'redux';

// AppDispatchの型付けを毎回やるのめんどいのでカスタムdispatchとして定義
export const useCustomDispatch = () => {
  const dispatch = useDispatch<
    ThunkDispatch<any, any, AnyAction> & AppDispatch
  >();
  return dispatch;
};
