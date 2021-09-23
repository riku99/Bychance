import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {default as axios} from 'axios';
import {baseUrl} from '~/constants/url';

import {RootState} from '~/stores';
import {setSetitngs} from '~/stores/settings';
import {useApikit} from './apikit';
import {useCustomDispatch} from './stores';
import {
  putRequestToUsersGroupsApplicationEnabled,
  putRequestToDisplay,
  putRequestToShowReceiveMessage,
  putRequestToTalkRoomMessagesReceipt,
} from '~/apis/settings';

export const useDisplay = () => {
  const {dispatch, handleApiError} = useApikit();
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
        await putRequestToDisplay(display);

        setDisplay(display);
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, setDisplay],
  );

  return {
    currentDisplay,
    setDisplay,
    changeDisplay,
  };
};

// experienceに移動させる
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
  const {dispatch, handleApiError} = useApikit();
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
      try {
        await putRequestToTalkRoomMessagesReceipt(receipt);
        setTalkRoomMessageReceipt(receipt);
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, setTalkRoomMessageReceipt],
  );

  return {
    changeTalkRoomMessageReceipt,
    currentTalkRoomMessageReceipt,
    setTalkRoomMessageReceipt,
  };
};

export const useShowReceiveMessage = () => {
  const {handleApiError, dispatch} = useApikit();
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
        await putRequestToShowReceiveMessage(showReceiveMessage);
        setShowReceiveMessage(showReceiveMessage);
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, setShowReceiveMessage],
  );

  return {
    changeShowReceiveMessage,
    currentShowReceiveMessage,
    setShowReceiveMessage,
  };
};

// experienceに移動
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

export const useGroupsApplicationEnabled = () => {
  const {handleApiError} = useApikit();
  const dispatch = useCustomDispatch();

  const groupsApplicationEnabled = useSelector(
    (state: RootState) => state.settingsReducer.groupsApplicationEnabled,
  );

  const setGroupsApplicationEnabled = useCallback(
    (v: boolean) => {
      dispatch(setSetitngs({groupsApplicationEnabled: v}));
    },
    [dispatch],
  );

  const changeGroupsApplicationEnabled = useCallback(
    async (value: boolean) => {
      try {
        await putRequestToUsersGroupsApplicationEnabled(value);
        setGroupsApplicationEnabled(value);

        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, setGroupsApplicationEnabled],
  );

  return {
    groupsApplicationEnabled,
    changeGroupsApplicationEnabled,
  };
};
