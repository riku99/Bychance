import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';

import {Post} from '../../redux/post';
import {basicStyles} from '../../constants/styles';

type PropsType = {posts: Post[]} & {
  navigateToShowPost: (post: Post) => void;
};

export const Posts = ({posts, navigateToShowPost}: PropsType) => {
  return (
    <View style={styles.posts}>
      {posts.map((p, i) => {
        return (
          <TouchableOpacity
            key={p.id}
            activeOpacity={1}
            onPress={async () => {
              navigateToShowPost({
                id: p.id,
                text: p.text,
                image: p.image,
                date: p.date,
                userId: p.userId,
              });
            }}>
            <View
              style={{
                backgroundColor: basicStyles.imageBackGroundColor,
                marginTop: 2,
              }}>
              <Image source={{uri: p.image}} style={styles.post} key={i} />
            </View>
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
    justifyContent: 'space-between',
  },
  post: {
    width: width / 3.02,
    height: width / 3.02,
  },
});
