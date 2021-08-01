import React from 'react';
import {useSelector} from 'react-redux';

import {Post} from './Post';
import {RootState} from '../../../stores/index';
import {
  MyPageStackRouteProp,
  UserPageStackRouteProp,
} from '../../../navigations/types';
import {useDeletePost} from '~/hooks/posts';

type Props = {
  route: MyPageStackRouteProp<'Post'> | UserPageStackRouteProp<'Post'>;
};

export const Container = React.memo(({route}: Props) => {
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });

  const {deletePost} = useDeletePost();

  const _deletePost = async (postId: number) => {
    deletePost({postId});
  };

  return <Post post={route.params} user={user} deletePost={_deletePost} />;
});
