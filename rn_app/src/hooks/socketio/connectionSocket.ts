import {useMemo} from 'react';
import io from 'socket.io-client';

export const useSokcetio = ({id}: {id?: string}) => {
  const socket = useMemo(() => {
    if (id) {
      return io('http://localhost:4001', {query: {id}});
    }
  }, [id]);
  return socket;
};
