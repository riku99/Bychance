import {useCallback} from 'react';
import {useSelector} from 'react-redux';

import {RootState} from '~/stores';
import {useCustomDispatch} from './stores';
import {setAppState} from '~/stores/app';

export const useBackGroundItemVideoPaused = () => {
  const dispatch = useCustomDispatch();
  const videoPaused = useSelector(
    (state: RootState) => state.appReducer.userBackGroundItemVideoPaused,
  );
  const setVideoPaused = useCallback(
    (v: boolean) => {
      dispatch(
        setAppState({
          userBackGroundItemVideoPaused: v,
        }),
      );
    },
    [dispatch],
  );

  return {
    videoPaused,
    setVideoPaused,
  };
};
