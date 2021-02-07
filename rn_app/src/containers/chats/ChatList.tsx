import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ChatList} from '../../components/chats/ChatList';
import {RootState} from '../../redux/index';
import {Room} from '../../redux/rooms';
import {selectAllRooms} from '../../redux/rooms';
import {selectChatPartnerEntities} from '../../redux/chatPartners';
import {RootStackParamList} from '../../screens/Root';

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const Container = () => {
  const rooms = useSelector(
    (state: RootState) => selectAllRooms(state),
    shallowEqual,
  );

  const chatPartnerEntities = useSelector((state: RootState) => {
    return selectChatPartnerEntities(state);
  });

  const navigationToChatRoom = useNavigation<RootNavigationProp>();

  const pushChatRoom = ({room, partnerId}: {room: Room; partnerId: number}) => {
    navigationToChatRoom.push('ChatRoomStack', {
      screen: 'ChatRoom',
      params: {room, partnerId},
    });
  };

  return (
    <ChatList
      rooms={rooms}
      chatPartnerEntites={chatPartnerEntities}
      pushChatRoom={pushChatRoom}
    />
  );
};
