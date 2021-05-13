import React from 'react';
import {StyleSheet} from 'react-native';
import {ListItem, Badge} from 'react-native-elements';

import {TalkRoom} from '~/stores/talkRooms/';
import {UserAvatar} from '../../utils/Avatar';
import {normalStyles} from '~/constants/styles/normal';

type Props = {
  room: TalkRoom;
  name?: string;
  avatar?: string | null;
  onPress: () => void;
};

export const TalkRoomListItem = React.memo(
  ({room, name, avatar, onPress}: Props) => {
    return (
      <ListItem key={room.id} onPress={onPress}>
        <UserAvatar image={avatar} size="medium" opacity={1} />
        <ListItem.Content>
          <ListItem.Title>{name ? name : 'ユーザーがいません'}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>
            {room.latestMessage && room.latestMessage}
          </ListItem.Subtitle>
        </ListItem.Content>
        {room.unreadNumber !== 0 && (
          <Badge
            value={room.unreadNumber}
            textStyle={{fontSize: 15}}
            badgeStyle={styles.badgeStyle}
          />
        )}
      </ListItem>
    );
  },
);

const styles = StyleSheet.create({
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
