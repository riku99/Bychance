import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ProfileStackParamList} from '../../screens/Profile';
import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';
import {Post, selectAllPosts} from '../../redux/post';
import {RootStackParamList} from '../../screens/Root';
import {selectAllFlashes} from '../../redux/flashes';

type ProfileNavigationProp = StackNavigationProp<ProfileStackParamList, 'Post'>;

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const Container = () => {
  const referenceId = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });

  const user = useSelector((state: RootState) => {
    return state.userReducer.user!;
  }, shallowEqual);

  const posts = useSelector((state: RootState) => {
    return selectAllPosts(state);
  }, shallowEqual);

  const flashes = useSelector((state: RootState) => {
    return selectAllFlashes(state);
  }, shallowEqual);

  const creatingFlash = useSelector((state: RootState) => {
    return state.indexReducer.creatingFlash;
  });

  const {display, lat, lng, ...restUserData} = user; // eslint-disable-line

  const profileStackNavigation = useNavigation<ProfileNavigationProp>();

  const rootstackNavigation = useNavigation<RootNavigationProp>();

  const pushPost = (post: Post) => {
    profileStackNavigation.push('Post', post);
  };

  const pushUserEdit = () => {
    rootstackNavigation.push('UserEdit');
  };

  const pushTakeFlash = () => {
    rootstackNavigation.push('TakeFlash');
  };

  // UserProfileからのみflashesプロパティをundefiend
  const pushFlashes = () => {
    rootstackNavigation.push('Flashes', {
      allFlashData: [
        {
          flashes: undefined,
          user: restUserData,
        },
      ],
      index: 0,
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
      referenceId={referenceId}
      posts={posts}
      flashes={flashes}
      creatingFlash={creatingFlash}
      navigateToPost={pushPost}
      navigateToUserEdit={pushUserEdit}
      navigateToTakeFlash={pushTakeFlash}
      navigateToFlashes={pushFlashes}
    />
  );
};
