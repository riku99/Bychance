import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfileStackParamList} from '../../screens/Profile';

import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';
import {PostType} from '../../redux/post';
import {checkKeychain} from '../../helpers/keychain';
import {RootStackParamList} from '../../screens/Root';

type ProfileNavigationProp = StackNavigationProp<ProfileStackParamList, 'Post'>;
type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const Container = () => {
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!;
  });
  const posts = useSelector((state: RootState) => {
    return state.postsReducer.posts;
  });
  const process = useSelector((state: RootState) => {
    return state.postsReducer.process;
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
  const navigationToUserEdit = useNavigation<RootNavigationProp>();

  const pushPost = (post: PostType) => {
    navigationToPost.push('Post', post);
  };

  const pushUserEdit = () => {
    navigationToUserEdit.push('UserEdit');
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
      postProcess={process}
      navigateToPost={pushPost}
      navigateToUserEdit={pushUserEdit}
    />
  );
};

export default Container;
