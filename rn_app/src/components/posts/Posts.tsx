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

type Props = {posts: Post[]} & {
  navigateToShowPost: (post: Post) => void;
};

export const Posts = React.memo(({posts, navigateToShowPost}: Props) => {
  const checkMiddleItem = (i: number) => {
    return (i + 1) % 3 === 0 ? true : false;
  };

  const createGap = () => {
    const n = width - (width / 3.02) * 3;
    return n / 2;
  };

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
                marginHorizontal: checkMiddleItem(i + 1) ? createGap() : 0,
              }}>
              <Image source={{uri: p.image}} style={styles.post} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  posts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  post: {
    width: width / 3.02,
    height: width / 3.02,
  },
});
