import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {backgroundItemHeight, nameAndAvatarLeft} from '../User/styles';

// 使ってない
export const Skelton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.background} />
      <View style={styles.avatar} />
      <View style={styles.name} />
      <View style={styles.introduce} />
      <View style={styles.introduce} />
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {},
  background: {
    height: backgroundItemHeight,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 80,
    left: nameAndAvatarLeft,
    transform: [{translateY: -35}],
  },
  name: {
    height: 20,
    width: 110,
    marginLeft: nameAndAvatarLeft,
    transform: [{translateY: -15}],
  },
  introduce: {
    height: 15,
    width: '70%',
    marginLeft: nameAndAvatarLeft,
    marginTop: 10,
  },
});
