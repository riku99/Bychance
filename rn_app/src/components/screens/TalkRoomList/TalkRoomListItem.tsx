import React from 'react';
import {StyleSheet} from 'react-native';
import {ListItem, Badge} from 'react-native-elements';

import {UserAvatar} from '../../utils/Avatar';
import {defaultTheme} from '~/theme';
import {TalkRoom} from '~/stores/_talkRooms';
import {useUserName, useUserAvatar} from '~/hooks/users';

type Props = {
  room: TalkRoom;
  onPress: () => void;
};

export const TalkRoomListItem = React.memo(({room, onPress}: Props) => {
  const badgeNumber = room.unreadMessages.length;
  const lastMessage = room.lastMessage;
  const avatar = useUserAvatar({
    userId: room.partner.id,
  });
  const name = useUserName(room.partner.id);

  return (
    <ListItem key={room.id} onPress={onPress}>
      <UserAvatar image={avatar} size="medium" opacity={1} />
      <ListItem.Content>
        <ListItem.Title style={styles.name}>
          {name ? name : 'メンバーが存在しません'}
        </ListItem.Title>
        <ListItem.Subtitle style={styles.subtitle}>
          {lastMessage && lastMessage.text}
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
    backgroundColor: defaultTheme.primary,
    fontSize: 15,
  },
  name: {
    fontWeight: 'bold',
  },
});
