import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {default as axios} from 'axios';
import {baseUrl} from '~/constants/url';

import {RootState} from '~/stores';
import {setSetitngs} from '~/stores/settings';
import {useApikit} from './apikit';

export const useDisplay = () => {
  const {dispatch, addBearer, checkKeychain, handleApiError} = useApikit();
  const currentDisplay = useSelector(
    (state: RootState) => state.settingsReducer.display,
  );
  const setDisplay = useCallback(
    (v: boolean) => {
      dispatch(setSetitngs({display: v}));
    },
    [dispatch],
  );

  const changeDisplay = useCallback(
    async (display: boolean) => {
      try {
        const credentials = await checkKeychain();
        await axios.put(
          `${baseUrl}/users/display?id=${credentials?.id}`,
          {display},
          addBearer(credentials?.token),
        );

        setDisplay(display);
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, addBearer, checkKeychain, setDisplay],
  );

  return {
    currentDisplay,
    setDisplay,
    changeDisplay,
  };
};

export const useVideoEditDescription = () => {
  const {addBearer, dispatch, checkKeychain, handleApiError} = useApikit();
  const currentVideoEditDesctiption = useSelector(
    (state: RootState) => state.settingsReducer.videoEditDescription,
  );
  const setVideoEditDesciption = useCallback(
    (v: boolean) => {
      dispatch(setSetitngs({videoEditDescription: v}));
    },
    [dispatch],
  );

  const changeVideoEditDescription = useCallback(
    async (bool: boolean) => {
      try {
        const credentials = await checkKeychain();
        await axios.put(
          `${baseUrl}/users/videoEditDescription?id=${credentials?.id}`,
          {videoEditDescription: bool},
          addBearer(credentials?.token),
        );

        setVideoEditDesciption(bool);
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, setVideoEditDesciption],
  );

  return {
    currentVideoEditDesctiption,
    changeVideoEditDescription,
    setVideoEditDesciption,
  };
};
