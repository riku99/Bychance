import React from 'react';
import {View, StyleSheet, Text, Image, Dimensions, Alert} from 'react-native';
import {Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

import {PostType} from '../../redux/post';

type PropsType = {
  post: PostType;
  user: number;
  deletePost: (id: number) => void;
};

export const Post = ({post, user, deletePost}: PropsType) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={{uri: post.image}} style={styles.image} />
      <View style={styles.upper_box}>
        <Text style={styles.date}>{post.date}</Text>
        {user === post.userId && (
          <Button
            icon={<Icon name="delete-outline" color="#999999" />}
            buttonStyle={{backgroundColor: 'transparent'}}
            onPress={() => {
              Alert.alert('投稿を削除', '本当に削除してよろしいですか?', [
                {
                  text: 'はい',
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
    </View>
  );
};

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: width,
    height: 400,
  },
  upper_box: {
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
    fontSize: 16,
  },
});
