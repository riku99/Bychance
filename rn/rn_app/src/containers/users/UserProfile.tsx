import React, {useEffect, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfileStackParamList} from '../../screens/Profile';

import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';
import {Post, selectAllPosts} from '../../redux/post';
import {checkKeychain} from '../../helpers/keychain';
import {RootStackParamList} from '../../screens/Root';

type ProfileNavigationProp = StackNavigationProp<ProfileStackParamList, 'Post'>;
type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const Container = () => {
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!;
  }, shallowEqual);
  const posts = useSelector((state: RootState) => {
    return selectAllPosts(state);
  }, shallowEqual);

  const [keychainId, setKeychainId] = useState<null | number>(null);

  useEffect(() => {
    const confirmUser = async () => {
      const keychain = await checkKeychain();
      if (keychain && keychain.id === user.id) {
        setKeychainId(keychain.id);
      }
    };
    confirmUser();
  }, [user.id]);

  const navigationToPost = useNavigation<ProfileNavigationProp>();
  const navigationForRoot = useNavigation<RootNavigationProp>();

  const pushPost = (post: Post) => {
    navigationToPost.push('Post', post);
  };

  const pushUserEdit = () => {
    navigationForRoot.push('UserEdit');
  };

  const pushTakeFlash = () => {
    navigationForRoot.push('Story');
  };

  return (
    <UserProfile
      user={{
        id: user.id,
        name: user.name,
        image: user.image,
        introduce: user.introduce,
      }}
      keychainId={keychainId}
      posts={posts}
      navigateToPost={pushPost}
      navigateToUserEdit={pushUserEdit}
      navigateToTakeFlash={pushTakeFlash}
    />
  );
};

export default Container;
