import {useCallback, useEffect, useState} from 'react';
import io, {Socket} from 'socket.io-client';
import {default as axios} from 'axios';

import {useMyId} from './users';
import {origin, baseUrl} from '~/constants/url';
import {useApikit} from './apikit';
import {
  GetApplyingGroupsResponse,
  GetAppliedGroupsResponse,
} from '~/types/response/applyingGroup';

export const useSetupApplyingGroupSocket = () => {
  const id = useMyId();
  const [socket, setSocket] = useState<Socket>();

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

  useEffect(() => {
    if (socket) {
      socket.on('applyGroup', (data) => {
        console.log(data);
      });
    }
  }, [socket]);

  // useEffect(() => {
  //   if (socket) {
  //     socket?.on('connect', () => {
  //       console.log('connectt');
  //     });
  //   }
  // }, [socket]);
};

export const useCreateApplyingGroup = () => {
  const {addBearer, checkKeychain, handleApiError} = useApikit();
  const applyGroup = useCallback(
    async ({userId}: {userId: string}) => {
      try {
        const credentials = await checkKeychain();
        const response = await axios.post(
          `${baseUrl}/applying_groups?id=${credentials?.id}`,
          {
            to: userId,
          },
          addBearer(credentials?.token),
        );
      } catch (e) {
        handleApiError(e);
      }
    },
    [addBearer, checkKeychain, handleApiError],
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

  const {addBearer, checkKeychain, handleApiError} = useApikit();
  const getAppliedGroup = useCallback(async () => {
    setIsLoading(true);
    try {
      const credentials = await checkKeychain();
      const response = await axios.get<GetAppliedGroupsResponse>(
        `${baseUrl}/applying_groups?id=${credentials?.id}&type=applied`,
        addBearer(credentials?.token),
      );

      setApplyedGroup(response.data);
    } catch (e) {
      handleApiError(e);
    } finally {
      setIsLoading(false);
    }
  }, [addBearer, checkKeychain, handleApiError]);

  useEffect(() => {
    getAppliedGroup();
  }, [getAppliedGroup]);

  return {
    applyedGroup,
    isLoading,
    getAppliedGroup,
  };
};

export const useGetApplyingGroups = () => {
  const [applyingGroups, setApplyingGroups] = useState<
    GetApplyingGroupsResponse
  >([]);
  const [isLoading, setIsloading] = useState(false);

  const {checkKeychain, addBearer} = useApikit();

  const getApplyingGroups = useCallback(async () => {
    setIsloading(true);
    try {
      const credentials = await checkKeychain();
      const response = await axios.get<GetApplyingGroupsResponse>(
        `${baseUrl}/applying_groups?id=${credentials?.id}`,
        addBearer(credentials?.token),
      );

      setApplyingGroups(response.data);
    } catch (e) {
    } finally {
      setIsloading(false);
    }
  }, [addBearer, checkKeychain]);

  useEffect(() => {
    getApplyingGroups();
  }, [getApplyingGroups]);

  return {
    applyingGroups,
    isLoading,
  };
};
