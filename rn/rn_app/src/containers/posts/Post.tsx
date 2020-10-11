import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Post} from '../../components/posts/Post';
import {RootState} from '../../redux/index';
import {deletePostAsync} from '../../actions/posts_action';

export const Container = () => {
  const {id, text, image, date, userID} = useSelector((state: RootState) => {
    return state.postReducer.post!;
  });
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });
  const dispatch = useDispatch();
  const deletePost = (id: number) => {
    dispatch(deletePostAsync(id));
  };
  return (
    <Post
      post={{id, text, image, date, userID}}
      user={user}
      deletePost={deletePost}
    />
  );
};
