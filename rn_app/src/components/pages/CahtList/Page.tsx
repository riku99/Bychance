import React from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ChatList} from './ChatList';
import {RootState} from '../../../stores/index';
import {Room, selectAllRooms} from '../../../stores/rooms';
import {resetRecievedMessage} from '../../../stores/otherSettings';
import {selectChatPartnerEntities} from '../../../stores/chatPartners';
import {RootStackParamList} from '../../../screens/Root';

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const ChatListPage = () => {
  const dispatch = useDispatch();
  const rooms = useSelector(
    (state: RootState) => selectAllRooms(state),
    shallowEqual,
  );

  const chatPartnerEntities = useSelector((state: RootState) => {
    console.log(selectChatPartnerEntities(state));
    return selectChatPartnerEntities(state);
  });

  const navigationToChatRoom = useNavigation<RootNavigationProp>();

  const pushChatRoom = ({room, partnerId}: {room: Room; partnerId: number}) => {
    dispatch(resetRecievedMessage());
    navigationToChatRoom.push('ChatRoomStack', {
      screen: 'ChatRoom',
      params: {roomId: room.id, partnerId},
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
