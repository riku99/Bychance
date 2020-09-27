import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from '../../redux/index';
import {Posts} from '../../components/posts/Posts';
import {setPostAction, PostType} from '../../redux/post';

export const Container = () => {
  const posts = useSelector((state: RootState) => {
    return state.postReducer.posts;
  });
  const dispatch = useDispatch();
  const setPost = async (post: PostType) => {
    dispatch(setPostAction(post));
  };
  return <Posts posts={posts} setPost={setPost} />;
};
