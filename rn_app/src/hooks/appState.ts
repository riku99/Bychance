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

export const useCreateingPost = () => {
  const dispatch = useCustomDispatch();
  const creatingPost = useSelector(
    (state: RootState) => state.appReducer.creatingPost,
  );
  const setCreatingPost = useCallback(
    (v: boolean) => {
      dispatch(setAppState({creatingPost: v}));
    },
    [dispatch],
  );

  return {
    creatingPost,
    setCreatingPost,
  };
};

export const useCreatingFlash = () => {
  const dispatch = useCustomDispatch();
  const creatingFlash = useSelector(
    (state: RootState) => state.appReducer.creatingFlash,
  );
  const setCreatingFlash = useCallback(
    (v: boolean) => {
      dispatch(setAppState({creatingFlash: v}));
    },
    [dispatch],
  );

  return {
    creatingFlash,
    setCreatingFlash,
  };
};

export const useDisplayedMenu = () => {
  const dispatch = useCustomDispatch();
  const displayedMenu = useSelector(
    (state: RootState) => state.appReducer.displayedMenu,
  );
  const setDisplayedMenu = useCallback(
    (v: boolean) => {
      dispatch(setAppState({displayedMenu: v}));
    },
    [dispatch],
  );

  return {
    displayedMenu,
    setDisplayedMenu,
  };
};

export const usePauseFlashPregress = () => {
  const dispatch = useCustomDispatch();
  const pauseFlashProgress = useSelector(
    (state: RootState) => state.appReducer.pauseFlashProgress,
  );
  const setPauseFlashProgress = useCallback(
    (v: boolean) => {
      dispatch(setAppState({pauseFlashProgress: v}));
    },
    [dispatch],
  );

  return {
    pauseFlashProgress,
    setPauseFlashProgress,
  };
};

export const useToastLoading = () => {
  const dispatch = useCustomDispatch();
  const toastLoading = useSelector(
    (state: RootState) => state.appReducer.toastLoading,
  );
  const setToastLoading = useCallback(
    (v: boolean) => {
      dispatch(setAppState({toastLoading: v}));
    },
    [dispatch],
  );

  return {
    toastLoading,
    setToastLoading,
  };
};
