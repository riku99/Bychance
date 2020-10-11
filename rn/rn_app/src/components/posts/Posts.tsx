import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {PostType} from '../../redux/post';
import {UserStackParamList} from '../../screens/User';

type PropsType = {posts: PostType[]} & {setPost: (post: PostType) => void};

type NavigationProp = StackNavigationProp<UserStackParamList, 'Post'>;

export const Posts = ({posts, setPost}: PropsType) => {
  const navigation = useNavigation<NavigationProp>();
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
              navigation.push('Post');
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
