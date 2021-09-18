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

  socket?.on('connect', () => {
    console.log('connectt');
  });
};
