import React from 'react';
import {useDispatch} from 'react-redux';

import {Post} from '../../components/posts/CreatePost';
import {createPostAction} from '../../actions/posts_action';
import {setProcessAction} from '../../redux/post';

export const Container = () => {
  const dispatch = useDispatch();
  const createPost = (data: {text: string; image: string}) => {
    dispatch(createPostAction(data));
  };
  const setProcess = () => {
    dispatch(setProcessAction());
  };
  return <Post createPost={createPost} setProcess={setProcess} />;
};
