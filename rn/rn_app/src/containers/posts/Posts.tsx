import React from 'react';
import {useSelector} from 'react-redux';

import {RootState} from '../../redux/index';
import {Posts} from '../../components/posts/Posts';

export const Container = () => {
  const posts = useSelector((state: RootState) => {
    return state.postReducer.posts;
  });
  return <Posts posts={posts} />;
};
