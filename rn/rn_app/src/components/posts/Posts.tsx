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

type PropsType = {posts: PostType[]} & {setPost: (post: PostType) => void};

export const Posts = ({posts, setPost}: PropsType) => {
  const navigation = useNavigation();
  return (
    <View style={styles.posts}>
      {posts.map((p, i) => {
        return (
          <TouchableOpacity
            key={p.id}
            activeOpacity={1}
            onPress={async () => {
              setPost({id: p.id, text: p.text, image: p.image, date: p.date});
              navigation.navigate('PostTable');
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
