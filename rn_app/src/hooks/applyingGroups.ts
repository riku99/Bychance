import {useCallback, useEffect, useState} from 'react';
import io, {Socket} from 'socket.io-client';
import {default as axios} from 'axios';

import {useMyId} from './users';
import {origin, baseUrl} from '~/constants/url';
import {useApikit} from './apikit';

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
