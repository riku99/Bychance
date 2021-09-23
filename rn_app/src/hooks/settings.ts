import {useCallback} from 'react';
import {useSelector} from 'react-redux';

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
