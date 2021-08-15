import React from 'react';
import {StyleSheet} from 'react-native';
import {ListItem, Badge} from 'react-native-elements';

import {UserAvatar} from '../../utils/Avatar';
import {normalStyles} from '~/constants/styles';
import {TalkRoom} from '~/types/store/talkRooms';

type Props = {
  room: TalkRoom;
  onPress: () => void;
};

export const TalkRoomListItem = React.memo(({room, onPress}: Props) => {
  const badgeNumber = room.unreadMessages.length;
  const {name, avatar} = room.partner;
  const lastMessage = room.lastMessage[0].text;

  return (
    <ListItem key={room.id} onPress={onPress}>
      <UserAvatar image={avatar} size="medium" opacity={1} />
      <ListItem.Content>
        <ListItem.Title>
          {name ? name : 'メンバーが存在しません'}
        </ListItem.Title>
        <ListItem.Subtitle style={styles.subtitle}>
          {lastMessage && lastMessage}
        </ListItem.Subtitle>
      </ListItem.Content>
      {badgeNumber !== 0 && (
        <Badge
          value={badgeNumber}
          textProps={{
            style: {
              fontSize: 15,
              color: 'white',
            },
          }}
          badgeStyle={styles.badgeStyle}
        />
      )}
    </ListItem>
  );
});

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
    fontSize: 15,
  },
});
