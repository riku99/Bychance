import {useCallback, useEffect, useState} from 'react';
import {useApikit} from '~/hooks/apikit';
import {postRequesutToRTCToken} from '~/apis/videoCalling';
import {useMyId} from './users';
import io, {Socket} from 'socket.io-client';
import {AppState, AppStateStatus} from 'react-native';
import Config from 'react-native-config';
import {useGettingCall} from '~/hooks/appState';
import {
  setVideoCallingState as _setVideoCallingState,
  VideoCallingState,
} from '~/stores/videoCalling';
import {useCustomDispatch} from './stores';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '~/stores';
import {useVideoCalling as useVideoCallingView} from '~/hooks/appState';

export const useVideoCallingState = () => {
  const dispatch = useCustomDispatch();
  const videoCallingState = useSelector(
    (state: RootState) => state.videoCallingReducer,
    shallowEqual,
  );
  const setVideoCallingState = useCallback(
    (data: Partial<VideoCallingState>) => {
      dispatch(_setVideoCallingState(data));
    },
    [dispatch],
  );

  return {
    videoCallingState,
    setVideoCallingState,
  };
};

export const useVideoCalling = () => {
  const {handleApiError} = useApikit();
  const {setVideoCalling} = useVideoCallingView();
  const {setVideoCallingState} = useVideoCallingState();
  const makeCall = useCallback(
    async (paylaod: {otherUserId: string}) => {
      const channelName = 'name';
      try {
        setVideoCalling(true);
        const response = await postRequesutToRTCToken({
          otherUserId: paylaod.otherUserId,
          channelName,
        });
        setVideoCallingState({
          token: response.data.token,
          uid: response.data.intUid,
          channelName,
          role: 'pub',
          publisher: null,
        });
        return response.data;
      } catch (e) {
        setVideoCalling(false);
        handleApiError(e);
      }
    },
    [handleApiError, setVideoCalling, setVideoCallingState],
  );

  return {
    makeCall,
  };
};

export const useSetupVideoCallingSocket = () => {
  const id = useMyId();
  const [socket, setSocket] = useState<Socket>();
  const {setGettingCall} = useGettingCall();
  const {setVideoCallingState} = useVideoCallingState();

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
    if (socket && id) {
      socket.on(
        'startCall',
        (data: {
          channelName: string;
          token: string;
          to: string;
          intUid: number;
          publisher: {
            id: string;
            name: string;
            image: string | null;
          };
        }) => {
          if (data.to !== id) {
            return;
          }
          setGettingCall(true);
          setVideoCallingState({
            channelName: data.channelName,
            token: data.token,
            uid: data.intUid,
            role: 'sub',
            publisher: data.publisher,
          });
        },
      );
    }
  }, [socket, setGettingCall, setVideoCallingState, id]);

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
