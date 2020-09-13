import React from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
const oji = require('../../assets/ojisan.jpg');
const sunny = require('../../assets/suny.jpg');
const buta = require('../../assets/buta.jpg');

const pic = [oji, sunny, buta];

export const UserPosts = () => {
  return (
    <View style={styles.posts}>
      {pic.map((p, i) => {
        return <Image source={p} style={styles.post} key={i} />;
      })}
    </View>
  );
};

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  posts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  post: {
    width: width / 3,
    height: width / 3,
  },
});
