import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {ListItem, Badge} from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';

import {TalkRoom} from '../../../stores/talkRooms';
import {UserAvatar} from '../../utils/Avatar';
import {ReturnTypeOfSelectChatPartnerEntities} from '../../../stores/chatPartners';
import {normalStyles} from '~/constants/styles/normal';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = {
  rooms: TalkRoom[];
  chatPartnerEntites: ReturnTypeOfSelectChatPartnerEntities;
  pushChatRoom: ({
    room,
    partnerId,
  }: {
    room: TalkRoom;
    partnerId: string;
  }) => void;
};

export const ChatList = ({rooms, chatPartnerEntites, pushChatRoom}: Props) => {
  return (
    <View style={styles.container}>
      <SwipeListView
        data={rooms}
        keyExtractor={(room) => room.id.toString()}
        renderItem={(room) => (
          <ListItem
            key={room.item.id}
            onPress={() => {
              pushChatRoom({
                room: room.item,
                partnerId: room.item.partner,
              });
            }}>
            <UserAvatar
              image={chatPartnerEntites[room.item.partner]?.avatar}
              size="medium"
              opacity={1}
            />
            <ListItem.Content>
              <ListItem.Title>
                {chatPartnerEntites[room.item.partner]?.name
                  ? chatPartnerEntites[room.item.partner]?.name
                  : 'ユーザーがいません'}
              </ListItem.Title>
              <ListItem.Subtitle style={styles.subtitle}>
                {room.item.latestMessage && room.item.latestMessage}
              </ListItem.Subtitle>
            </ListItem.Content>
            {room.item.unreadNumber !== 0 && (
              <Badge
                value={room.item.unreadNumber}
                textStyle={{fontSize: 15}}
                badgeStyle={styles.badgeStyle}
              />
            )}
          </ListItem>
        )}
        renderHiddenItem={() => (
          <View>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: '#f54542',
                height: '100%',
                width: width / 4,
                alignSelf: 'flex-end',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 17, fontWeight: '400', color: 'white'}}>
                削除
              </Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-(width / 4)}
      />
    </View>
  );
};

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 3,
  },
  badgeStyle: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: normalStyles.mainColor,
  },
});
