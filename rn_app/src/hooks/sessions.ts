import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {default as axios} from 'axios';

import {RootState} from '~/stores/index';
import {baseUrl} from '~/constants/url';
import {useApikit} from './apikit';
import {SuccessfullLoginData} from '~/types/login';
import {setLogin} from '~/stores/sessions';
import {setUser} from '~/stores/user';
import {setPosts} from '~/stores/posts';
import {setTalkRooms} from '~/stores/talkRooms';
import {setTalkRoomMessages} from '~/stores/talkRoomMessages';
import {setFlashes} from '~/stores/flashes';
import {setChatPartners} from '~/stores/chatPartners';
import {setFlashStamps} from '~/stores/flashStamps';

export const useSessionloginProccess = () => {
  const {dispatch, checkKeychain, addBearer, handleApiError} = useApikit();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loginProccess = async () => {
      const credentials = await checkKeychain();
      if (credentials) {
        const {id, token} = credentials;
        try {
          const response = await axios.get<SuccessfullLoginData>(
            `${baseUrl}/sessions/sessionLogin?id=${id}`,
            addBearer(token),
          );
          const {
            user,
            posts,
            rooms,
            messages,
            flashes,
            chatPartners,
            flashStamps,
          } = response.data;
          dispatch(setLogin(true));
          dispatch(setUser(user));
          dispatch(setPosts(posts));
          dispatch(setTalkRooms(rooms));
          dispatch(setTalkRoomMessages(messages));
          dispatch(setFlashes(flashes));
          dispatch(setChatPartners(chatPartners));
          dispatch(setFlashStamps(flashStamps));
        } catch (e) {
          handleApiError(e);
        }
      }
      setIsLoading(false);
    };
    loginProccess();
  }, [dispatch, checkKeychain, addBearer, handleApiError]);

  return {
    isLoading,
  };
};

export const useLoginSelect = () => {
  const login = useSelector((state: RootState) => {
    return state.sessionReducer.login;
  });
  return login;
};
