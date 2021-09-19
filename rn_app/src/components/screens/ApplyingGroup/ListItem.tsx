import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-elements';

import {UserAvatar} from '~/components/utils/Avatar';
import {defaultTheme} from '~/theme';

type Props = {
  id: number;
  name: string;
  imageUrl: string | null;
  type: 'applied' | 'applying';
};

export const ListItem = React.memo(({id, name, imageUrl, type}: Props) => {
  return (
    <View style={styles.listItem}>
      <UserAvatar image={imageUrl} size="medium" />
      <View style={styles.listItemRight}>
        <Text style={styles.listText}>
          <Text style={styles.name}>{name}</Text>
          {type === 'applied'
            ? 'さんから申請されています。'
            : 'さんに申請しています。'}
        </Text>
        <View style={styles.buttons}>
          {type === 'applied' && (
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
          )}
          <Button
            title={type === 'applied' ? '削除する' : '取り消す'}
            titleStyle={styles.buttonTitle}
            buttonStyle={[
              styles.button,
              {
                backgroundColor: defaultTheme.darkGray,
              },
            ]}
            containerStyle={{marginLeft: type === 'applied' ? 15 : 0}}
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
