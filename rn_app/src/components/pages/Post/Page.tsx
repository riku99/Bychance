import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Post} from './Post';
import {RootState} from '../../../redux/index';
import {deletePostThunk} from '../../../actions/posts';
import {
  MyPageStackRouteProp,
  UserPageStackRouteProp,
} from '../../../screens/types';

type Props = {
  route: MyPageStackRouteProp<'Post'> | UserPageStackRouteProp<'Post'>;
};

export const Container = ({route}: Props) => {
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });
  const dispatch = useDispatch();
  const deletePost = (id: number) => {
    dispatch(deletePostThunk(id));
  };
  return <Post post={route.params} user={user} deletePost={deletePost} />;
};
