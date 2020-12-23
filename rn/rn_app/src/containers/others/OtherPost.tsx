import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RouteProp} from '@react-navigation/native';

import {SearchStackParamList} from '../../screens/Search';
import {Post} from '../../components/posts/Post';
import {deletePostThunk} from '../../actions/posts';
import {RootState, AppDispatch} from '../../redux/index';

type screensRouteProp = RouteProp<SearchStackParamList, 'Post'>;

type Props = {route: screensRouteProp};

export const Container = ({route}: Props) => {
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });
  const dispatch: AppDispatch = useDispatch();
  const deletePost = (id: number) => {
    dispatch(deletePostThunk(id));
  };

  return <Post post={route.params} user={user} deletePost={deletePost} />;
};
