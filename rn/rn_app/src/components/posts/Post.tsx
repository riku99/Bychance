import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

const sunny = require('../../assets/suny.jpg');

export const Post = () => {
  return (
    <View style={styles.container}>
      <Image source={sunny} style={styles.image} />
      <Text style={styles.text}>sunny</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 450,
  },
  text: {
    width: '95%',
    marginTop: 20,
    fontSize: 16,
  },
});
