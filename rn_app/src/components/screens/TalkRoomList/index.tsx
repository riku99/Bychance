import React, {useCallback} from 'react';
import {View, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view';

import {TalkRoomListItem} from './TalkRoomListItem';
import {SwipeHiddenItems, hiddenRowItemWidth} from './SwipeHiddenItems';
import {RootNavigationProp} from '../../../navigations/Root';
import {useSelectAllRooms, useDeleteTalkRoom} from '~/hooks/talkRooms';

export const TalkRoomListPage = () => {
  const {deleteTalkRoom} = useDeleteTalkRoom();
  const rooms = useSelectAllRooms();
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const onItemPress = (data: {
    talkRoomId: number;
    partner: {
      id: string;
    };
  }) => {
    navigation.navigate('TalkRoomStack', {
      screen: 'TalkRoom',
      params: data,
    });
  };

  const onDeletePress = useCallback(
    ({talkRoomId}: {talkRoomId: number}) => {
      Alert.alert('トークルームを削除', '本当に削除してもよろしいですか?', [
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            deleteTalkRoom({talkRoomId});
            // await dispatch(createDeleteRoomThunk({talkRoomId}));
          },
        },
        {
          text: 'いいえ',
        },
      ]);
    },
    [deleteTalkRoom],
  );

  return (
    <View>
      <SwipeListView
        data={rooms}
        keyExtractor={(room) => room.id.toString()}
        renderItem={(room) => (
          <TalkRoomListItem
            room={room.item}
            onPress={() => {
              const {id, partner} = room.item;
              onItemPress({
                talkRoomId: id,
                partner,
              });
            }}
          />
        )}
        renderHiddenItem={(room) => (
          <SwipeHiddenItems
            onDeletePress={() => onDeletePress({talkRoomId: room.item.id})}
          />
        )}
        rightOpenValue={-hiddenRowItemWidth}
      />
    </View>
  );
};
