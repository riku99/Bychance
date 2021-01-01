import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RouteProp} from '@react-navigation/native';

import {Post} from '../../components/posts/Post';
import {RootState} from '../../redux/index';
import {ProfileStackParamList} from '../../screens/Profile';
import {deletePostThunk} from '../../actions/posts';

type screenRouteProp = RouteProp<ProfileStackParamList, 'Post'>;

type Props = {route: screenRouteProp};

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
