import React from 'react';
import {StyleSheet, Text} from 'react-native';

type Props = {
  children: string;
};

export const Title = ({children}: Props) => {
  return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 20,
  },
});
