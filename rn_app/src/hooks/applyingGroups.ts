import {useCallback, useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import io, {Socket} from 'socket.io-client';
import {showMessage} from 'react-native-flash-message';
import Config from 'react-native-config';

import {useMyId} from './users';
import {useApikit} from './apikit';
import {
  ResponseForGetAppliedGroups,
  ResponseForGetApplyingGroups,
} from '~/apis/applyingGroups/types';
import {
  getRequestToAppliedGroups,
  postRequestApplyingGroups,
  getRequestToApplyingGroups,
  deleteRequestToApplyingGroups,
} from '~/apis/applyingGroups';
import {useGroupBadge} from './appState';
import {useToastLoading} from './appState';

export const useSetupApplyingGroupSocket = () => {
  const id = useMyId();
  const [socket, setSocket] = useState<Socket>();
  const {setGroupBadge} = useGroupBadge();

  useEffect(() => {
    if (!id && socket) {
      // @ts-ignore
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(undefined);
    }
  }, [id, socket]);

  // アクティブ時に毎回サブスクリプション。それ以外は切断。
  useEffect(() => {
    const onChange = (nextAppEvent: AppStateStatus) => {
      if (nextAppEvent === 'active') {
        if (id && !socket) {
          setSocket(io(`${Config.ORIGIN}/applying_group`, {query: {id}}));
        }
      } else {
        if (socket) {
          // @ts-ignore
          socket.removeAllListeners();
          socket.disconnect();
          setSocket(undefined);
        }
      }
    };

    AppState.addEventListener('change', onChange);

    return () => {
      AppState.removeEventListener('change', onChange);
    };
  }, [id, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('applyGroup', () => {
        showMessage({
          message: 'グループ申請を受け取りました',
          description: '',
          duration: 2000,
          style: {backgroundColor: '#00163b'},
          titleStyle: {fontWeight: 'bold'},
        });
        setGroupBadge(true);
      });
    }
  }, [socket, setGroupBadge]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('🌙 connect with applying group socket');
      });

      socket.on('disconnect', () => {
        console.log('✋ disconnect with applying group socket');
      });
    }
  }, [socket]);
};

export const useCreateApplyingGroup = () => {
  const {handleApiError} = useApikit();
  const applyGroup = useCallback(
    async ({userId}: {userId: string}) => {
      try {
        await postRequestApplyingGroups({userId});
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError],
  );

  return {
    applyGroup,
  };
};

export const useGetAppliedGroups = () => {
  const [appliedGroups, setAppliedGroups] = useState<
    ResponseForGetAppliedGroups
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const {handleApiError} = useApikit();
  const getAppliedGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getRequestToAppliedGroups();
      setAppliedGroups(response.data);
    } catch (e) {
      handleApiError(e);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    getAppliedGroups();
  }, [getAppliedGroups]);

  return {
    appliedGroups,
    isLoading,
    getAppliedGroups,
    setAppliedGroups,
  };
};

export const useGetApplyingGroups = () => {
  const [applyingGroups, setApplyingGroups] = useState<
    ResponseForGetApplyingGroups
  >([]);
  const [isLoading, setIsloading] = useState(true);

  const getApplyingGroups = useCallback(async () => {
    setIsloading(true);
    try {
      const response = await getRequestToApplyingGroups();

      setApplyingGroups(response.data);
    } catch (e) {
    } finally {
      setIsloading(false);
    }
  }, []);

  useEffect(() => {
    getApplyingGroups();
  }, [getApplyingGroups]);

  return {
    applyingGroups,
    setApplyingGroups,
    isLoading,
  };
};

export const useAppliedGropusOnActive = () => {
  const {setGroupBadge} = useGroupBadge();

  useEffect(() => {
    const onActive = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const response = await getRequestToAppliedGroups();
        if (response.data.length) {
          setGroupBadge(true);
        } else {
          setGroupBadge(false);
        }
      }
    };

    AppState.addEventListener('change', onActive);

    return () => {
      AppState.removeEventListener('change', onActive);
    };
  }, [setGroupBadge]);
};

export const useDeleteApplyingGroup = () => {
  const {handleApiError, toast} = useApikit();
  const {setToastLoading} = useToastLoading();

  const deleteApplyingGroup = useCallback(
    async ({id}: {id: number}) => {
      setToastLoading(true);
      try {
        const response = await deleteRequestToApplyingGroups({id});

        toast?.show('削除しました', {type: 'success'});
        return response.data;
      } catch (e) {
        handleApiError(e);
      } finally {
        setToastLoading(false);
      }
    },
    [handleApiError, setToastLoading, toast],
  );

  return {
    deleteApplyingGroup,
  };
};
