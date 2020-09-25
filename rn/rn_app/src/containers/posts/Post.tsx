import React from 'react';
import {useDispatch} from 'react-redux';

import {Post} from '../../components/posts/Post';
import {createPostAction, createPostType} from '../../actions/posts_action';

export const Container = () => {
  const dispatch = useDispatch();
  const createPost = (data: createPostType) => {
    dispatch(createPostAction(data));
  };
  return <Post createPost={createPost} />;
};
