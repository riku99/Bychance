import React from 'react';
import {useSelector} from 'react-redux';

import {Post} from './Post';
import {RootState} from '../../../stores/index';
import {deletePostThunk} from '../../../thunks/posts/deletePost';
import {
  MyPageStackRouteProp,
  UserPageStackRouteProp,
} from '../../../navigations/types';
import {useCustomDispatch} from '~/hooks/stores';

type Props = {
  route: MyPageStackRouteProp<'Post'> | UserPageStackRouteProp<'Post'>;
};

export const Container = React.memo(({route}: Props) => {
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });
  const dispatch = useCustomDispatch();

  const deletePost = async (postId: number) => {
    await dispatch(deletePostThunk({postId}));
  };
  return <Post post={route.params} user={user} deletePost={deletePost} />;
});
