import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';

import {AppDispatch} from '~/stores/index';
import {AnyAction} from 'redux';
import {setLogin} from '~/stores/sessions';
import {setUser, resetUser} from '~/stores/user';
import {setPosts, resetPosts} from '~/stores/posts';
import {setTalkRooms, resetTalkRooms} from '~/stores/talkRooms';
import {
  setTalkRoomMessages,
  resetTalkRoomMessages,
} from '~/stores/talkRoomMessages';
import {setFlashes, resetFlashes} from '~/stores/flashes';
import {setChatPartners, resetChatPartners} from '~/stores/chatPartners';
import {setFlashStamps, resetFlashStamps} from '~/stores/flashStamps';
import {SuccessfullLoginData} from '~/types/login';

// AppDispatchの型付けを毎回やるのめんどいのでカスタムdispatchとして定義
export const useCustomDispatch = () => {
  const dispatch = useDispatch<
    ThunkDispatch<any, any, AnyAction> & AppDispatch
  >();
  return dispatch;
};

export const useSuccessfullLoginDispatch = () => {
  const dispatch = useCustomDispatch();

  const loginDispatch = useCallback(
    ({
      user,
      posts,
      rooms,
      messages,
      flashes,
      chatPartners,
      flashStamps,
    }: SuccessfullLoginData) => {
      dispatch(setUser(user));
      dispatch(setPosts(posts));
      dispatch(setTalkRooms(rooms));
      dispatch(setTalkRoomMessages(messages));
      dispatch(setFlashes(flashes));
      dispatch(setChatPartners(chatPartners));
      dispatch(setFlashStamps(flashStamps));
      dispatch(setLogin(true));
    },
    [dispatch],
  );

  return {
    loginDispatch,
  };
};

export const useResetDispatch = () => {
  const dispatch = useCustomDispatch();

  const resetDispatch = useCallback(() => {
    dispatch(setLogin(false));
    dispatch(resetPosts());
    dispatch(resetTalkRooms());
    dispatch(resetTalkRoomMessages());
    dispatch(resetFlashes());
    dispatch(resetChatPartners());
    dispatch(resetFlashStamps());
    dispatch(resetUser());
  }, [dispatch]);

  return {
    resetDispatch,
  };
};
