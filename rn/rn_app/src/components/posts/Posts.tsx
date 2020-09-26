import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {PostType} from '../../redux/post';

//const oji = require('../../assets/ojisan.jpg');
//const sunny = require('../../assets/suny.jpg');
//const buta = require('../../assets/buta.jpg');
//const pic = [oji, sunny, buta];

type PropsType = {posts: PostType[]};

export const Posts = ({posts}: PropsType) => {
  const navigation = useNavigation();
  return (
    <View style={styles.posts}>
      {posts.map((p, i) => {
        return (
          <TouchableOpacity
            key={p.id}
            activeOpacity={1}
            onPress={() => {
              navigation.navigate('Post');
            }}>
            <Image source={{uri: p.image}} style={styles.post} key={i} />
          </TouchableOpacity>
        );
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
