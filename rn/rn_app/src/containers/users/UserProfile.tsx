import React from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfileStackParamList} from '../../screens/Profile';

import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';
import {PostType} from '../../redux/post';

type NavigationProp = StackNavigationProp<ProfileStackParamList, 'Post'>;

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

  const navigation = useNavigation<NavigationProp>();
  const navigateToShowPost = (post: PostType) => {
    navigation.push('Post', post);
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
      navigateToShowPost={navigateToShowPost}
    />
  );
};

export default Container;
