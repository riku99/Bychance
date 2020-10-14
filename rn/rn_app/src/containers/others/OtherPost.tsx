import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RouteProp} from '@react-navigation/native';

import {SearchStackParamList} from '../../screens/Search';
import {Post} from '../../components/posts/Post';
import {deletePostAsync} from '../../actions/posts_action';
import {RootState, AppDispatch} from '../../redux/index';

type screensRouteProp = RouteProp<SearchStackParamList, 'OtherPost'>;

type Props = {route: screensRouteProp};

export const Container = ({route}: Props) => {
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });
  const dispatch: AppDispatch = useDispatch();
  const deletePost = (id: number) => {
    dispatch(deletePostAsync(id));
  };

  return <Post post={route.params} user={user} deletePost={deletePost} />;
};
