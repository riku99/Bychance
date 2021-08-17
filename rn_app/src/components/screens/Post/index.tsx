import React from 'react';
import {mutate} from 'swr';

import {Post} from './Post';
import {
  MyPageStackRouteProp,
  UserPageStackRouteProp,
} from '../../../navigations/types';
import {useDeletePost} from '~/hooks/posts';
import {useMyId, userPageUrlKey} from '~/hooks/users';
import {useNavigation} from '@react-navigation/native';
import {UserPageInfo} from '~/types/response/users';

type Props = {
  route: MyPageStackRouteProp<'Post'> | UserPageStackRouteProp<'Post'>;
};

export const Container = React.memo(({route}: Props) => {
  const myId = useMyId();

  const {deletePost} = useDeletePost();
  const navigation = useNavigation();

  const _deletePost = async (postId: number) => {
    await deletePost({postId});

    mutate(
      userPageUrlKey(myId),
      (currentData: UserPageInfo) => {
        const filtered = currentData.posts.filter((p) => p.id !== postId);
        return {
          ...currentData,
          posts: filtered,
        };
      },
      false,
    );
    navigation.goBack();
  };

  return <Post post={route.params} user={myId} deletePost={_deletePost} />;
});
