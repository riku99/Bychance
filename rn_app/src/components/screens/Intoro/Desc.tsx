import React from 'react';
import {StyleSheet, Text} from 'react-native';

type Props = {
  children: Element | string;
};

export const Desc = ({children}: Props) => {
  return <Text style={styles.text}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    marginTop: 20,
    fontSize: 17,
    color: '#7a7a7a',
    fontWeight: 'bold',
    lineHeight: 24,
  },
});
