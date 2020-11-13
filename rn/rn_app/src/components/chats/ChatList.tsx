import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';

import {Room} from '../../redux/rooms';
import {MessageType} from '../../redux/messages';

const noImage = require('../../assets/no-Image.png');

type Props = {
  rooms: Room[];
  latestMessages: {[key: number]: MessageType};
  pushChatRoom: (room: Room) => void;
};

export const ChatList = ({rooms, latestMessages, pushChatRoom}: Props) => {
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
                  size="small"
                  source={r.partner.image ? r.partner.image : noImage}
                />
                <ListItem.Content>
                  <ListItem.Title>{r.partner.name}</ListItem.Title>
                  <ListItem.Subtitle style={styles.subtitle}>
                    {latestMessages[r.messages[0]] &&
                      latestMessages[r.messages[0]].text}
                  </ListItem.Subtitle>
                </ListItem.Content>
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
