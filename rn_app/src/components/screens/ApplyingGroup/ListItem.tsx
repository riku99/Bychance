import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-elements';

import {UserAvatar} from '~/components/utils/Avatar';
import {defaultTheme} from '~/theme';

type Props = {
  id: number;
  name: string;
  imageUrl: string | null;
};

export const ListItem = React.memo(({id, name, imageUrl}: Props) => {
  return (
    <View style={styles.listItem}>
      <UserAvatar image={imageUrl} size="medium" />
      <View style={styles.listItemRight}>
        <Text style={styles.listText}>
          <Text style={styles.name}>{name}</Text>
          さんから申請されています。
        </Text>
        <View style={styles.buttons}>
          <Button
            title="参加する"
            titleStyle={styles.buttonTitle}
            buttonStyle={[
              styles.button,
              {
                backgroundColor: defaultTheme.pinkGrapefruit,
              },
            ]}
            activeOpacity={1}
          />
          <Button
            title="削除する"
            titleStyle={styles.buttonTitle}
            buttonStyle={[
              styles.button,
              {
                backgroundColor: defaultTheme.darkGray,
              },
            ]}
            containerStyle={{marginLeft: 15}}
            activeOpacity={1}
          />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  listItemRight: {
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  listText: {},
  name: {
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    width: 80,
    padding: 5,
  },
  buttonTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
