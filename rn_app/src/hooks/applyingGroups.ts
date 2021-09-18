import {useEffect, useState} from 'react';
import io, {Socket} from 'socket.io-client';

import {useMyId} from './users';
import {origin} from '~/constants/url';

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
