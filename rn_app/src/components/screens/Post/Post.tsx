import React from 'react';
import {View, StyleSheet, Text, Dimensions, Alert} from 'react-native';
import {Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import {Post as PostType} from '../../../stores/posts';
import {normalStyles} from '../../../constants/styles';
import {ScrollView} from 'react-native-gesture-handler';
import {VideoWithThumbnail} from '~/components/utils/VideowithThumbnail';

type Props = {
  post: PostType;
  user: string;
  deletePost: (id: number) => void;
};

export const Post = ({post, user, deletePost}: Props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.sourceContainer}>
          {post.sourceType === 'image' ? (
            <FastImage
              source={{uri: post.url}}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <VideoWithThumbnail
              video={{
                source: {
                  uri: post.url,
                },
                resizeMode: 'cover',
                repeat: true,
              }}
            />
          )}
        </View>
        <View style={styles.upperBox}>
          <Text style={styles.date}>{post.date}</Text>
          {user === post.userId && (
            <Button
              icon={<Icon name="delete-outline" color="#999999" />}
              buttonStyle={{backgroundColor: 'transparent'}}
              onPress={() => {
                Alert.alert('投稿を削除', '本当に削除してよろしいですか?', [
                  {
                    text: 'はい',
                    style: 'destructive',
                    onPress: () => {
                      deletePost(post.id);
                      navigation.goBack();
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
    backgroundColor: normalStyles.imageBackGroundColor,
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
