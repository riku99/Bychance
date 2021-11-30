import {useCallback, useEffect, useState} from 'react';
import {useApikit} from '~/hooks/apikit';
import {postRequesutToRTCToken} from '~/apis/videoCalling';
import {PostRequestToRTCToken} from '~/apis/videoCalling/types';
import {useMyId} from './users';
import io, {Socket} from 'socket.io-client';
import {AppState, AppStateStatus} from 'react-native';
import Config from 'react-native-config';

export const useVideoCallingToken = () => {
  const {handleApiError} = useApikit();
  const createToken = useCallback(
    async (paylaod: PostRequestToRTCToken['payload']) => {
      try {
        const response = await postRequesutToRTCToken(paylaod);
        console.log(response.data.token);
        return response.data.token;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError],
  );

  return {
    createToken,
  };
};

export const useSetupVideoCallingSocket = () => {
  const id = useMyId();
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    if (!id && socket) {
      // @ts-ignore
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(undefined);
    }
  }, [socket, id]);

  useEffect(() => {
    const onChange = (nextAppEvent: AppStateStatus) => {
      if (nextAppEvent === 'active') {
        if (id && !socket) {
          setSocket(io(`${Config.ORIGIN}/video_calling`, {query: {id}}));
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
      socket.on('startCall', () => {
        console.log('📞 get call!');
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('🤙 connect with video calling socket');
      });

      socket.on('disconnect', () => {
        console.log('✋ disconnect with video calling socket');
      });
    }
  }, [socket]);
};
