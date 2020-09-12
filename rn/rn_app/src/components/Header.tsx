import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';

export const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>MyApp</Text>
    </View>
  );
};

let {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    height: 70,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
  headerTitle: {
    color: '#9ccbf7',
    fontSize: 20,
    marginTop: 30,
  },
});
