import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ChatList} from '../../components/chats/ChatList';
import {RootState} from '../../redux/index';
import {selectAllRooms, Room} from '../../redux/rooms';
import {
  selectLatestMessageEntities,
  selsectNotReadMessageNumber,
} from '../../redux/messages';
import {RootStackParamList} from '../../screens/Root';

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const Container = () => {
  const {rooms, latestMessages} = useSelector((state: RootState) => {
    const _rooms = selectAllRooms(state);
    const _latestMessages = selectLatestMessageEntities(state, _rooms);
    return {rooms: _rooms, latestMessages: _latestMessages};
  }, shallowEqual);

  const notReadMessageNumbers = useSelector((state: RootState) => {
    const _rooms = selectAllRooms(state);
    return selsectNotReadMessageNumber(state, _rooms);
  }, shallowEqual);

  const navigationToChatRoom = useNavigation<RootNavigationProp>();

  const pushChatRoom = (room: Room) => {
    navigationToChatRoom.push('ChatRoomStack', {
      screen: 'ChatRoom',
      params: room,
    });
  };

  return (
    <ChatList
      rooms={rooms}
      latestMessages={latestMessages}
      notReadNumber={notReadMessageNumbers}
      pushChatRoom={pushChatRoom}
    />
  );
};
