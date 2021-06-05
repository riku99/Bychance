import React, {useMemo} from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {Post} from '../../../stores/posts';
import {normalStyles} from '../../../constants/styles';
import {
  UserPageNavigationProp,
  MyPageNavigationProp,
} from '../../../screens/types';
import {getThumbnailUrl} from '~/helpers/video';

type Props = {
  post: Post;
  index: number;
};

export const TabViewPost = React.memo(({post, index}: Props) => {
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

  const sourceType = useMemo(() => post.sourceType, [post.sourceType]);

  return (
    <View style={styles.posts}>
      <TouchableOpacity
        key={post.id}
        activeOpacity={1}
        onPress={() => onPress(post)}>
        <View
          style={[
            styles.postWrapper,
            {marginHorizontal: checkMiddleItem(index + 1) ? createGap() : 0},
          ]}>
          <FastImage
            source={{
              uri:
                sourceType === 'image' ? post.url : getThumbnailUrl(post.url),
            }}
            style={styles.post}
          />
        </View>
        {sourceType === 'video' && (
          <MIcon
            name="play-arrow"
            color="white"
            size={25}
            style={styles.playIcon}
          />
        )}
      </TouchableOpacity>
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
  postWrapper: {
    backgroundColor: normalStyles.imageBackGroundColor,
    borderRadius: 10,
    marginBottom: 2,
  },
  playIcon: {
    position: 'absolute',
    top: 10,
    right: 5,
  },
});
