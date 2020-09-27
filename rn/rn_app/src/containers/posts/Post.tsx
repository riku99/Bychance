import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Post} from '../../components/posts/Post';
import {RootState} from '../../redux/index';

export const Container = () => {
  const {id, text, image} = useSelector((state: RootState) => {
    return state.postReducer.post!;
  });
  return <Post id={id} text={text} image={image} />;
};
