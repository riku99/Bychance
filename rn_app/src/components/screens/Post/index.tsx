import React, {useLayoutEffect} from 'react';

import {Post} from './Post';
import {
  MyPageStackRouteProp,
  UserPageStackRouteProp,
} from '../../../navigations/types';
import {useDeletePost} from '~/hooks/posts';
import {useMyId} from '~/hooks/users';
import {useNavigation} from '@react-navigation/native';

type Props = {
  route: MyPageStackRouteProp<'Post'> | UserPageStackRouteProp<'Post'>;
};

export const Container = React.memo(({route}: Props) => {
  const myId = useMyId();

  const {deletePost} = useDeletePost();
  const navigation = useNavigation();

  // useLayoutEffect(() => {
  //   navigation.setOptions({headerShown: false});
  // }, [navigation]);

  const _deletePost = async (postId: number) => {
    await deletePost({postId});
    navigation.goBack();
  };

  return <Post post={route.params} user={myId} deletePost={_deletePost} />;
});
