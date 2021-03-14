import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ListItem, Badge} from 'react-native-elements';

import {Room} from '../../../stores/rooms';
import {UserAvatar} from '../../utils/Avatar';
import {ReturnTypeOfSelectChatPartnerEntities} from '../../../stores/chatPartners';

type Props = {
  rooms: Room[];
  chatPartnerEntites: ReturnTypeOfSelectChatPartnerEntities;
  pushChatRoom: ({room, partnerId}: {room: Room; partnerId: number}) => void;
};

export const ChatList = ({rooms, chatPartnerEntites, pushChatRoom}: Props) => {
  return (
    <View style={styles.container}>
      {rooms.length
        ? rooms.map((r) => {
            return (
              <ListItem
                key={r.id}
                onPress={() => {
                  pushChatRoom({
                    room: r,
                    partnerId: r.partner,
                  });
                }}>
                <UserAvatar
                  image={chatPartnerEntites[r.partner]?.image}
                  size="medium"
                  opacity={1}
                />
                <ListItem.Content>
                  <ListItem.Title>
                    {chatPartnerEntites[r.partner]?.name
                      ? chatPartnerEntites[r.partner]?.name
                      : 'ユーザーがいません'}
                  </ListItem.Title>
                  <ListItem.Subtitle style={styles.subtitle}>
                    {r.latestMessage && r.latestMessage}
                  </ListItem.Subtitle>
                </ListItem.Content>
                {r.unreadNumber !== 0 && (
                  <Badge
                    value={r.unreadNumber}
                    textStyle={{fontSize: 15}}
                    badgeStyle={{width: 25, height: 25, borderRadius: 25 / 2}}
                  />
                )}
              </ListItem>
            );
          })
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 3,
  },
});
