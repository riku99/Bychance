import React from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';

import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';
import {setPostAction, PostType} from '../../redux/post';

export const Container = () => {
  const user = useSelector((state: RootState) => {
    return state.othersReducer.otherUser!;
  }, shallowEqual);
  const dispatch = useDispatch();
  const setPost = async (post: PostType) => {
    dispatch(setPostAction(post));
  };
  return (
    <UserProfile
      user={{
        id: user.id,
        name: user.name,
        image: user.image,
        introduce: user.introduce,
      }}
      posts={user.posts}
      setPost={setPost}
      navigateToShowPost={() => {
        console.log('navi');
      }}
    />
  );
};
