import {useMemo} from 'react';
import io from 'socket.io-client';

const _origin = 'http://192.168.128.159:4001';
//const _origin = 'http://localhost:4001';

export const useSokcetio = ({id}: {id?: string}) => {
  const socket = useMemo(() => {
    if (id) {
      return io(_origin, {query: {id}});
    }
  }, [id]);
  return socket;
};
