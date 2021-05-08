import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, Icon} from 'react-native-elements';

import {User} from '~/stores/user';
import {normalStyles} from '~/constants/styles/normal';

type Props = {
  source: User['backGroundItem'];
  type: User['backGroundItemType'];
  onPress: () => void;
  onDeletePress: () => void;
};

export const BackGroundItem = React.memo(
  ({source, type, onPress, onDeletePress}: Props) => {
    if (source && type === 'image') {
      return (
        <>
          <TouchableOpacity activeOpacity={1} onPress={onPress}>
            <FastImage source={{uri: source}} style={styles.source} />
          </TouchableOpacity>
          <Button
            activeOpacity={1}
            onPress={onDeletePress}
            icon={<Icon name="delete" color="white" size={30} />}
            buttonStyle={styles.deleteButton}
            containerStyle={styles.deleteButtonContainer}
          />
        </>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.noneSoruce}
          activeOpacity={1}
          onPress={onPress}
        />
      );
    }
  },
);

const styles = StyleSheet.create({
  source: {
    width: '100%',
    height: '100%',
  },
  noneSoruce: {
    width: '100%',
    height: '100%',
    backgroundColor: normalStyles.imageBackGroundColor,
  },
  deleteButtonContainer: {
    position: 'absolute',
    right: 10,
    bottom: 5,
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
});
