import {useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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

export const useGroupBadge = () => {
  const dispatch = useCustomDispatch();
  const groupBadge = useSelector(
    (state: RootState) => state.appReducer.groupBadge,
  );
  const setGroupBadge = useCallback(
    (v: boolean) => {
      dispatch(setAppState({groupBadge: v}));
    },
    [dispatch],
  );

  return {
    groupBadge,
    setGroupBadge,
  };
};

export const useSetSafeArea = () => {
  const {top} = useSafeAreaInsets();
  const dispatch = useCustomDispatch();

  useEffect(() => {
    dispatch(setAppState({safeArea: {top}}));
  }, []); // eslint-disable-line
};

export const useSafeArea = () => {
  const dispatch = useCustomDispatch();
  const top = useSelector((state: RootState) => state.appReducer.safeArea.top);
  const setSafeArea = useCallback(
    ({top: _top}: {top: number}) => {
      dispatch(setAppState({safeArea: {top: _top}}));
    },
    [dispatch],
  );

  return {
    top,
    setSafeArea,
  };
};

export const useLoginDataLoading = () => {
  const dispatch = useCustomDispatch();
  const loginDataLoading = useSelector(
    (state: RootState) => state.appReducer.loginDataLoading,
  );
  const setLoginDataLoading = useCallback(
    (value: boolean) => {
      dispatch(setAppState({loginDataLoading: value}));
    },
    [dispatch],
  );

  return {
    loginDataLoading,
    setLoginDataLoading,
  };
};

export const useVideoCalling = () => {
  const dispatch = useCustomDispatch();
  const videoCalling = useSelector(
    (state: RootState) => state.appReducer.videoCalling,
  );
  const setVideoCalling = useCallback(
    (value: boolean) => {
      dispatch(setAppState({videoCalling: value}));
    },
    [dispatch],
  );

  return {
    videoCalling,
    setVideoCalling,
  };
};

export const useGettingCall = () => {
  const dispatch = useCustomDispatch();
  const gettingCall = useSelector(
    (state: RootState) => state.appReducer.gettingCall,
  );
  const setGettingCall = useCallback(
    (value: boolean) => {
      dispatch(setAppState({gettingCall: value}));
    },
    [dispatch],
  );

  return {
    gettingCall,
    setGettingCall,
  };
};

export const useVideoCallingAlertModalVisible = () => {
  const dispatch = useCustomDispatch();
  const videoCallingAlertModalVisible = useSelector(
    (state: RootState) => state.appReducer.videoCallingAlertModalVisible,
  );
  const setVideoCallingAlertModalVisible = useCallback(
    (v: boolean) => {
      dispatch(setAppState({videoCallingAlertModalVisible: v}));
    },
    [dispatch],
  );

  return {
    videoCallingAlertModalVisible,
    setVideoCallingAlertModalVisible,
  };
};
