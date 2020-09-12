import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';

export const Hooter = () => {
  return <View style={styles.hooter}></View>;
};

const styles = StyleSheet.create({
  hooter: {
    flexDirection: 'row',
    height: 50,
    borderTopColor: '#e8e8e8',
    borderTopWidth: 1,
  },
});
