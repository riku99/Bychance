import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../redux/index';
import {Post} from '../../components/posts/CreatePost';
import {createPostAction, createPostType} from '../../actions/posts_action';
import {falseRedirectAction} from '../../redux/post';

export const Container = () => {
  const redirect = useSelector((state: RootState) => {
    return state.postReducer.redirect;
  });
  const dispatch = useDispatch();
  const createPost = (data: createPostType) => {
    dispatch(createPostAction(data));
  };
  const falseRedirect = () => {
    dispatch(falseRedirectAction());
  };
  return (
    <Post
      createPost={createPost}
      redirect={redirect}
      falseRedirect={falseRedirect}
    />
  );
};
