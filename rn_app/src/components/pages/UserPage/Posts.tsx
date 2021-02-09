import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Post} from '../../../redux/post';
import {basicStyles} from '../../../constants/styles';
import {
  UserPageNavigationProp,
  MyPageNavigationProp,
} from '../../../screens/types';

type Props = {posts: Post[]};

export const Posts = React.memo(({posts}: Props) => {
  const checkMiddleItem = (i: number) => {
    return (i + 1) % 3 === 0 ? true : false;
  };

  const createGap = () => {
    const n = width - (width / 3.02) * 3;
    return n / 2;
  };

  const navigation = useNavigation<
    UserPageNavigationProp<'UserPage'> & MyPageNavigationProp<'MyPage'>
  >();

  const onPress = (post: Post) => {
    navigation.push('Post', post);
  };

  return (
    <View style={styles.posts}>
      {posts.map((p, i) => {
        return (
          <TouchableOpacity
            key={p.id}
            activeOpacity={1}
            onPress={() => onPress(p)}>
            <View
              style={[
                styles.postWrapper,
                {marginHorizontal: checkMiddleItem(i + 1) ? createGap() : 0},
              ]}>
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
    borderRadius: 10,
  },
  postWrapper: {
    backgroundColor: basicStyles.imageBackGroundColor,
    borderRadius: 10,
    marginBottom: 2,
  },
});
