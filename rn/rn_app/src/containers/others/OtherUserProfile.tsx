import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';
import {PostType} from '../../redux/post';
import {SearchStackParamList} from '../../screens/Search';

type NavigationProp = StackNavigationProp<SearchStackParamList, 'OtherProfile'>;

export const Container = () => {
  const user = useSelector((state: RootState) => {
    return state.othersReducer.otherUser!;
  }, shallowEqual);

  const navigation = useNavigation<NavigationProp>();
  const navigateToShowPost = (post: PostType) => {
    navigation.push('OtherPost', {
      id: post.id,
      text: post.text,
      image: post.image,
      date: post.date,
      userID: post.userID,
    });
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
      navigateToShowPost={navigateToShowPost}
    />
  );
};
