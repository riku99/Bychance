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

export const useTalkRoomMessageReceipt = () => {
  const {addBearer, checkKeychain, dispatch, handleApiError} = useApikit();
  const currentTalkRoomMessageReceipt = useSelector(
    (state: RootState) => state.settingsReducer.talkRoomMessageReceipt,
  );
  const setTalkRoomMessageReceipt = useCallback(
    (v: boolean) => {
      dispatch(setSetitngs({talkRoomMessageReceipt: v}));
    },
    [dispatch],
  );
  const changeTalkRoomMessageReceipt = useCallback(
    async ({receipt}: {receipt: boolean}) => {
      const credentials = await checkKeychain();

      try {
        await axios.put(
          `${baseUrl}/users/talkRoomMessageReceipt?id=${credentials?.id}`,
          {receipt},
          addBearer(credentials?.token),
        );

        setTalkRoomMessageReceipt(receipt);
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, setTalkRoomMessageReceipt],
  );

  return {
    changeTalkRoomMessageReceipt,
    currentTalkRoomMessageReceipt,
    setTalkRoomMessageReceipt,
  };
};

export const useShowReceiveMessage = () => {
  const {checkKeychain, handleApiError, addBearer, dispatch} = useApikit();
  const currentShowReceiveMessage = useSelector(
    (state: RootState) => state.settingsReducer.showReceiveMessage,
  );
  const setShowReceiveMessage = useCallback(
    (v: boolean) => {
      dispatch(setSetitngs({showReceiveMessage: v}));
    },
    [dispatch],
  );

  const changeShowReceiveMessage = useCallback(
    async ({showReceiveMessage}: {showReceiveMessage: boolean}) => {
      try {
        const credentials = await checkKeychain();
        await axios.put(
          `${baseUrl}/users/showReceiveMessage?id=${credentials?.id}`,
          {showReceiveMessage},
          addBearer(credentials?.token),
        );

        setShowReceiveMessage(showReceiveMessage);
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, handleApiError, addBearer, setShowReceiveMessage],
  );

  return {
    changeShowReceiveMessage,
    currentShowReceiveMessage,
    setShowReceiveMessage,
  };
};

export const useIntro = () => {
  const {dispatch, checkKeychain, addBearer, handleApiError} = useApikit();
  const currentIntro = useSelector(
    (state: RootState) => state.settingsReducer.intro,
  );
  const setIntro = useCallback(
    (v: boolean) => {
      dispatch(setSetitngs({intro: v}));
    },
    [dispatch],
  );
  const changeIntro = useCallback(
    async (v: boolean) => {
      try {
        const credentials = await checkKeychain();
        await axios.put(
          `${baseUrl}/users/intro?id=${credentials?.id}`,
          {intro: v},
          addBearer(credentials?.token),
        );

        setIntro(v);
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, setIntro],
  );

  return {
    currentIntro,
    setIntro,
    changeIntro,
  };
};
