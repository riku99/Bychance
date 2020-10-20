import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {UserProfile} from '../../components/users/UserProfile';
import {PostType} from '../../redux/post';
import {SearchStackParamList} from '../../screens/Search';

type NavigationProp = StackNavigationProp<SearchStackParamList, 'OtherProfile'>;

type ScreenRouteProp = RouteProp<SearchStackParamList, 'OtherProfile'>;

type Props = {route: ScreenRouteProp};

export const Container = ({route}: Props) => {
  const user = route.params;

  const navigation = useNavigation<NavigationProp>();
  const navigateToShowPost = (post: PostType) => {
    navigation.push('OtherPost', {
      id: post.id,
      text: post.text,
      image: post.image,
      date: post.date,
      userId: post.userId,
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
