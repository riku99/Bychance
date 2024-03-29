import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';

import {AppDispatch} from '~/stores/index';
import {AnyAction} from 'redux';
import {setLogin} from '~/stores/sessions';
import {resetUser} from '~/stores/user';
import {resetFlashes, removeFlashes} from '~/stores/flashes';
import {removePosts, resetPosts} from '~/stores/posts';
import {useFlashes} from './flashes';
import {usePosts} from './posts';
import {resetTalkRooms} from '~/stores/_talkRooms';
import {resetUsers} from '~/stores/_users';
import {resetAppState} from '~/stores/app';
import {resetError} from '~/stores/errors';
import {resetExperiences} from '~/stores/experiences';
import {resetSettings} from '~/stores/settings';

// AppDispatchの型付けを毎回やるのめんどいのでカスタムdispatchとして定義
export const useCustomDispatch = () => {
  const dispatch = useDispatch<
    ThunkDispatch<any, any, AnyAction> & AppDispatch
  >();
  return dispatch;
};

export const useResetDispatch = () => {
  const dispatch = useCustomDispatch();

  const resetDispatch = useCallback(() => {
    dispatch(setLogin(false));
    dispatch(resetFlashes());
    dispatch(resetUser());
    dispatch(resetPosts());
    dispatch(resetTalkRooms());
    dispatch(resetUsers());
    dispatch(resetAppState());
    dispatch(resetError());
    dispatch(resetExperiences());
    dispatch(resetSettings());
  }, [dispatch]);

  return {
    resetDispatch,
  };
};

export const useRemovePostsAndFlashesDispatch = ({
  userId,
}: {
  userId: string;
}) => {
  const dispatch = useCustomDispatch();
  const flasheIds = useFlashes({userId}).map((f) => f.id);
  const postIds = usePosts({userId}).map((p) => p.id);

  const removeDispatch = useCallback(() => {
    dispatch(removeFlashes(flasheIds));
    dispatch(removePosts(postIds));
  }, [dispatch, flasheIds, postIds]);

  return {
    removeDispatch,
  };
};
