import {useDispatch} from 'react-redux';

import {AppDispatch} from '~/stores/index';

// AppDispatchの型付けを毎回やるのめんどいのでカスタムdispatchとして定義
export const useCustomDispatch = (): AppDispatch => {
  const dispatch: AppDispatch = useDispatch();
  return dispatch;
};
