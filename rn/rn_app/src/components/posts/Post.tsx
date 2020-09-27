import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

import {PostType} from '../../redux/post';

type PropsType = PostType;

export const Post = ({id, text, image}: PropsType) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: image}} style={styles.image} />
      <Text style={styles.text}>{text}</Text>
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
