import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {unwrapResult} from '@reduxjs/toolkit';

import {UserProfile} from '../../components/users/UserProfile';
import {Post} from '../../redux/post';
import {SearchStackParamList} from '../../screens/Search';
import {AppDispatch, RootState} from '../../redux';
import {createRoomThunk} from '../../actions/rooms';
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
  const routeParam = route.params;

  const {flashes, ...restUserData} = routeParam;

  const referenceId = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });

  const dispatch: AppDispatch = useDispatch();

  const searchStackNavigation = useNavigation<SearchNavigationProp>();

  const rootStackNavigation = useNavigation<RootNavigationProp>();

  const pushPost = (post: Post) => {
    searchStackNavigation.push('OtherPost', {
      id: post.id,
      text: post.text,
      image: post.image,
      date: post.date,
      userId: post.userId,
    });
  };

  const pushChatRoom = () => {
    dispatch(createRoomThunk(routeParam))
      .then(unwrapResult)
      .then((payload) => {
        const selectedRoom = selectRoom(payload.id);
        if (selectedRoom) {
          rootStackNavigation.push('ChatRoom', {
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

  const pushFlashes = () => {
    rootStackNavigation.push('Flashes', {
      allFlashesWithUser: [
        {
          flashes: routeParam.flashes,
          user: restUserData,
        },
      ],
      index: 0,
    });
  };

  return (
    <UserProfile
      user={{
        id: routeParam.id,
        name: routeParam.name,
        image: routeParam.image,
        introduce: routeParam.introduce,
      }}
      referenceId={referenceId}
      posts={routeParam.posts}
      navigateToPost={pushPost}
      navigateToChatRoom={pushChatRoom}
      navigateToFlashes={pushFlashes}
      flashes={flashes.entities}
    />
  );
};
