import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';

import {PostType} from '../../redux/post';

type PropsType = {posts: PostType[]} & {setPost: (post: PostType) => void} & {
  navigateToShowPost: (post: PostType) => void;
};

export const Posts = ({posts, setPost, navigateToShowPost}: PropsType) => {
  return (
    <View style={styles.posts}>
      {posts.map((p, i) => {
        return (
          <TouchableOpacity
            key={p.id}
            activeOpacity={1}
            onPress={async () => {
              setPost({
                id: p.id,
                text: p.text,
                image: p.image,
                date: p.date,
                userID: p.userID,
              });
              navigateToShowPost({
                id: p.id,
                text: p.text,
                image: p.image,
                date: p.date,
                userID: p.userID,
              });
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
