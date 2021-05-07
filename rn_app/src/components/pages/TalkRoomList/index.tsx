import React from 'react';
import {View} from 'react-native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SwipeListView} from 'react-native-swipe-list-view';

import {TalkRoomListItem} from './TalkRoomListItem';
import {SwipeHiddenItems, hiddenRowItemWidth} from './SwipeHiddenItems';
import {RootState} from '../../../stores/index';
import {TalkRoom, selectAllRooms} from '../../../stores/talkRooms';
import {resetRecievedMessage} from '../../../stores/otherSettings';
import {selectChatPartnerEntities} from '../../../stores/chatPartners';
import {RootStackParamList} from '../../../screens/Root';

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const TalkRoomListPage = () => {
  const dispatch = useDispatch();
  const rooms = useSelector(
    (state: RootState) => selectAllRooms(state),
    shallowEqual,
  );

  const chatPartnerEntities = useSelector((state: RootState) => {
    return selectChatPartnerEntities(state);
  });

  const navigationToChatRoom = useNavigation<RootNavigationProp>();

  const pushChatRoom = ({
    room,
    partnerId,
  }: {
    room: TalkRoom;
    partnerId: string;
  }) => {
    dispatch(resetRecievedMessage());
    navigationToChatRoom.push('ChatRoomStack', {
      screen: 'ChatRoom',
      params: {roomId: room.id, partnerId},
    });
  };

  return (
    <View>
      <SwipeListView
        data={rooms}
        keyExtractor={(room) => room.id.toString()}
        renderItem={(room) => (
          <TalkRoomListItem
            room={room.item}
            avatar={chatPartnerEntities[room.item.partner]?.avatar}
            name={chatPartnerEntities[room.item.partner]?.name}
            onPress={() =>
              pushChatRoom({
                room: room.item,
                partnerId: room.item.partner,
              })
            }
          />
        )}
        renderHiddenItem={() => <SwipeHiddenItems />}
        rightOpenValue={-hiddenRowItemWidth}
      />
    </View>
  );
};
