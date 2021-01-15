import React from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ChatList} from '../../components/chats/ChatList';
import {RootState} from '../../redux/index';
import {Room} from '../../redux/rooms';
import {selectAllRooms} from '../../redux/rooms';
import {RootStackParamList} from '../../screens/Root';

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const Container = () => {
  const rooms = useSelector((state: RootState) => selectAllRooms(state));

  const navigationToChatRoom = useNavigation<RootNavigationProp>();

  const pushChatRoom = (room: Room) => {
    navigationToChatRoom.push('ChatRoomStack', {
      screen: 'ChatRoom',
      params: room,
    });
  };

  return <ChatList rooms={rooms} pushChatRoom={pushChatRoom} />;
};
