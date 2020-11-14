import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {unwrapResult} from '@reduxjs/toolkit';

import {UserProfile} from '../../components/users/UserProfile';
import {Post} from '../../redux/post';
import {SearchStackParamList} from '../../screens/Search';
import {AppDispatch} from '../../redux';
import {createRoomThunk} from '../../actions/rooms';
import {checkKeychain} from '../../helpers/keychain';
import {RootStackParamList} from '../../screens/Root';
import {selectRoom} from '../../redux/rooms';
import {alertSomeError} from '../../helpers/error';

type SearchNavigationProp = StackNavigationProp<
  SearchStackParamList,
  'OtherProfile'
>;
type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

type SearchScreenRouteProp = RouteProp<SearchStackParamList, 'OtherProfile'>;

type Props = {route: SearchScreenRouteProp};

export const Container = ({route}: Props) => {
  const user = route.params;

  const [keychainId, setKeychainId] = useState<null | number>(null);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const confirmUser = async () => {
      const keychain = await checkKeychain();
      if (keychain && keychain.id === user.id) {
        setKeychainId(keychain.id);
      }
    };
    confirmUser();
  }, [user.id]);

  const navigationToPost = useNavigation<SearchNavigationProp>();
  const navigationToUserEdit = useNavigation<RootNavigationProp>();
  const navigationToChatRoom = useNavigation<RootNavigationProp>();

  const pushPost = (post: Post) => {
    navigationToPost.push('OtherPost', {
      id: post.id,
      text: post.text,
      image: post.image,
      date: post.date,
      userId: post.userId,
    });
  };

  const pushUserEdit = () => {
    navigationToUserEdit.push('UserEdit');
  };

  const pushChatRoom = () => {
    dispatch(createRoomThunk(user))
      .then(unwrapResult)
      .then((payload) => {
        const selectedRoom = selectRoom(payload.id);
        if (selectedRoom) {
          navigationToChatRoom.push('ChatRoom', {
            id: selectedRoom.id,
            partner: selectedRoom.partner,
            timestamp: selectedRoom.timestamp,
            messages: selectedRoom.messages,
          });
        } else {
          alertSomeError();
        }
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
      posts={user.posts}
      navigateToPost={pushPost}
      navigateToUserEdit={pushUserEdit}
      navigateToChatRoom={pushChatRoom}
    />
  );
};
