import {useCallback, useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import io, {Socket} from 'socket.io-client';
import {showMessage} from 'react-native-flash-message';

import {useMyId} from './users';
import {origin} from '~/constants/url';
import {useApikit} from './apikit';
import {
  GetApplyingGroupsResponse,
  GetAppliedGroupsResponse,
} from '~/types/response/applyingGroup';
import {
  getRequestToAppliedGroups,
  postRequestApplyingGroups,
  getRequestToApplyingGroups,
  deleteRequestToApplyingGroups,
} from '~/apis/applyingGroups';
import {useGroupBadge} from './appState';

export const useSetupApplyingGroupSocket = () => {
  const id = useMyId();
  const [socket, setSocket] = useState<Socket>();

  // 初回レンダリングではonChangeが実行されないのでここでサブスクリプション
  useEffect(() => {
    if (id) {
      setSocket(io(`${origin}/applying_group`, {query: {id}}));
    }
  }, [id]);

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
          setSocket(io(`${origin}/applying_group`, {query: {id}}));
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
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket?.on('connect', () => {
        console.log('connectt');
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
  const [applyedGroup, setApplyedGroup] = useState<GetAppliedGroupsResponse>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const {handleApiError} = useApikit();
  const getAppliedGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getRequestToAppliedGroups();

      setApplyedGroup(response.data);
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
    applyedGroup,
    isLoading,
    getAppliedGroups,
    setApplyedGroup,
  };
};

export const useGetApplyingGroups = () => {
  const [applyingGroups, setApplyingGroups] = useState<
    GetApplyingGroupsResponse
  >([]);
  const [isLoading, setIsloading] = useState(false);

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
    const _fetch = async () => {
      const response = await getRequestToAppliedGroups();
      if (response.data.length) {
        setGroupBadge(true);
      }
    };
    _fetch();
  }, [setGroupBadge]);

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
  const {handleApiError} = useApikit();

  const deleteApplyingGroup = useCallback(
    async ({id}: {id: number}) => {
      try {
        const response = await deleteRequestToApplyingGroups({id});

        return response.data;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError],
  );

  return {
    deleteApplyingGroup,
  };
};
