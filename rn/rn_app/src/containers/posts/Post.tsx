import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RouteProp} from '@react-navigation/native';

import {Post} from '../../components/posts/Post';
import {RootState} from '../../redux/index';
import {ProfileStackParamList} from '../../screens/Profile';
import {deletePostAsync} from '../../actions/posts';

type screenRouteProp = RouteProp<ProfileStackParamList, 'Post'>;

type Props = {route: screenRouteProp};

export const Container = ({route}: Props) => {
  const post = route.params;
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });
  const dispatch = useDispatch();
  const deletePost = (id: number) => {
    dispatch(deletePostAsync(id));
  };
  return (
    <Post
      post={{
        id: post.id,
        text: post.text,
        image: post.image,
        date: post.date,
        userID: post.userID,
      }}
      user={user}
      deletePost={deletePost}
    />
  );
};
