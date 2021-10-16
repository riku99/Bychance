import React from 'react';
import {View, StyleSheet, Text, Dimensions, Alert} from 'react-native';
import {Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {format} from 'date-fns';

import {ScrollView} from 'react-native-gesture-handler';
import {VideoWithThumbnail} from '~/components/utils/VideowithThumbnail';
import {PostScreenType} from '~/navigations/UserPage';
import {defaultTheme} from '~/theme';

type Props = {
  post: PostScreenType;
  user: string;
  deletePost: (id: number) => void;
};

export const Post = ({post, user, deletePost}: Props) => {
  let resizeMode: 'contain' | 'cover' = 'cover';
  if (post.width && post.height) {
    post.width > post.height
      ? (resizeMode = 'contain')
      : (resizeMode! = 'cover');
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.sourceContainer}>
          {post.sourceType === 'image' ? (
            <FastImage
              source={{uri: post.url}}
              style={styles.image}
              resizeMode={resizeMode}
            />
          ) : (
            <VideoWithThumbnail
              video={{
                source: {
                  uri: post.url,
                },
                repeat: true,
                resizeMode,
              }}
              thumbnail={{
                resizeMode,
              }}
            />
          )}
        </View>
        <View style={styles.upperBox}>
          <Text style={styles.date}>
            {format(new Date(post.createdAt), 'yyyy/MM/dd')}
          </Text>
          {user === post.userId && (
            <Button
              activeOpacity={1}
              icon={<Icon name="delete-outline" color="#999999" />}
              buttonStyle={{backgroundColor: 'transparent'}}
              onPress={() => {
                Alert.alert('投稿を削除', '本当に削除してよろしいですか?', [
                  {
                    text: 'はい',
                    style: 'destructive',
                    onPress: async () => {
                      deletePost(post.id);
                    },
                  },
                  {text: 'いいえ'},
                ]);
              }}
            />
          )}
        </View>
        <Text style={styles.text}>{post.text}</Text>
      </ScrollView>
    </View>
  );
};

const {width} = Dimensions.get('screen');
const quarterSize = width / 3;
const postHeight = quarterSize * 4; // Postはとりあえず 3:4 の比率にするのでheightを計算して取得

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollViewContainer: {
    alignItems: 'center',
    width: width,
  },
  sourceContainer: {
    width: width,
    height: postHeight,
    // backgroundColor: defaultTheme.imageBackGroundColor,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  upperBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    height: 40,
  },
  date: {
    color: '#999999',
  },
  text: {
    width: '95%',
    marginTop: 10,
    fontSize: 14,
  },
});
