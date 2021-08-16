import React from 'react';

import {Post} from './Post';
import {
  MyPageStackRouteProp,
  UserPageStackRouteProp,
} from '../../../navigations/types';
import {useDeletePost} from '~/hooks/posts';
import {useMyId} from '~/hooks/users';

type Props = {
  route: MyPageStackRouteProp<'Post'> | UserPageStackRouteProp<'Post'>;
};

export const Container = React.memo(({route}: Props) => {
  const myId = useMyId();

  const {deletePost} = useDeletePost();

  const _deletePost = async (postId: number) => {
    deletePost({postId});
  };

  return <Post post={route.params} user={myId} deletePost={_deletePost} />;
});
