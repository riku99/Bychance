import React, {useEffect, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ProfileStackParamList} from '../../screens/Profile';
import {UserProfile, FlashUserInfo} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';
import {Post, selectAllPosts} from '../../redux/post';
import {checkKeychain} from '../../helpers/keychain';
import {RootStackParamList} from '../../screens/Root';
import {selectAllFlashes} from '../../redux/flashes';

type ProfileNavigationProp = StackNavigationProp<ProfileStackParamList, 'Post'>;

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const Container = () => {
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
    navigationForRoot.push('TakeFlash');
  };

  const pushShowFlash = ({userId, userName, userImage}: FlashUserInfo) => {
    navigationForRoot.push('ShowFlash', {
      userId,
      userName,
      userImage,
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
      keychainId={keychainId}
      posts={posts}
      flashes={flashes}
      creatingFlash={creatingFlash}
      navigateToPost={pushPost}
      navigateToUserEdit={pushUserEdit}
      navigateToTakeFlash={pushTakeFlash}
      navigateToShowFlash={pushShowFlash}
    />
  );
};

export default Container;
