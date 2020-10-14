import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {UserStackParamList} from '../../screens/Profile';

import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';
import {setPostAction, PostType} from '../../redux/post';

type NavigationProp = StackNavigationProp<UserStackParamList, 'Post'>;

export const Container = () => {
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!;
  });
  const posts = useSelector((state: RootState) => {
    return state.postReducer.posts;
  });
  const process = useSelector((state: RootState) => {
    return state.postReducer.process;
  });

  const dispatch = useDispatch();
  const setPost = async (post: PostType) => {
    dispatch(setPostAction(post));
  };

  const navigation = useNavigation<NavigationProp>();
  const navigateToShowPost = () => {
    navigation.push('Post');
  };
  return (
    <UserProfile
      user={{
        id: user.id,
        name: user.name,
        image: user.image,
        introduce: user.introduce,
      }}
      posts={posts}
      postProcess={process}
      setPost={setPost}
      navigateToShowPost={navigateToShowPost}
    />
  );
};

export default Container;
