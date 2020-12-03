import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {ListItem, Avatar, Badge} from 'react-native-elements';

import {Room} from '../../redux/rooms';
import {MessageType} from '../../redux/messages';

const noImage = require('../../assets/noImage.png');

type Props = {
  rooms: Room[];
  latestMessages: {[key: number]: MessageType};
  notReadNumber: {[key: number]: number};
  pushChatRoom: (room: Room) => void;
};

export const ChatList = ({
  rooms,
  latestMessages,
  notReadNumber,
  pushChatRoom,
}: Props) => {
  return (
    <View style={styles.container}>
      {rooms.length
        ? rooms.map((r) => {
            return (
              <ListItem
                key={r.id}
                onPress={() => {
                  pushChatRoom(r);
                }}>
                <Avatar
                  rounded
                  size="medium"
                  source={r.partner.image ? {uri: r.partner.image} : noImage}
                />
                <ListItem.Content>
                  <ListItem.Title>{r.partner.name}</ListItem.Title>
                  <ListItem.Subtitle style={styles.subtitle}>
                    {latestMessages[r.messages[0]] &&
                      latestMessages[r.messages[0]].text}
                  </ListItem.Subtitle>
                </ListItem.Content>
                {notReadNumber[r.id] !== 0 && (
                  <Badge
                    value={notReadNumber[r.id]}
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
