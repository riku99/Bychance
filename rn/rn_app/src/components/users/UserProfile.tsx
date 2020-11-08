import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Posts} from '../posts/Posts';
import {ScrollView} from 'react-native-gesture-handler';
import {PostType} from '../../redux/post';

type Props = {
  user: {
    id: number;
    name: string;
    image: string | null;
    introduce: string | null;
  };
  keychainId: number | null;
  postProcess?: boolean;
  posts: PostType[];
  navigateToPost: (post: PostType) => void;
  navigateToUserEdit?: () => void;
  navigateToChatRoom?: () => Promise<void>;
};

export const UserProfile = ({
  user,
  posts,
  keychainId,
  postProcess,
  navigateToPost,
  navigateToUserEdit,
  navigateToChatRoom,
}: Props) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.image}>
        <Avatar
          rounded
          source={
            user.image
              ? {uri: user.image}
              : require('../../assets/no-Image.png')
          }
          size="large"
          placeholderStyle={{backgroundColor: 'transeparent'}}
        />
      </View>
      <View style={styles.name_box}>
        <Text style={styles.name}>{user.name}</Text>
      </View>
      <View style={styles.edit}>
        {keychainId === user.id ? (
          <Button
            title="プロフィールを編集"
            titleStyle={styles.title_style}
            buttonStyle={styles.edit_button}
            onPress={navigateToUserEdit}
          />
        ) : (
          <Button
            title="メッセージを送る"
            icon={
              <Icon
                name="send-o"
                size={17}
                color="#2c3e50"
                style={{marginRight: 8}}
              />
            }
            titleStyle={{...styles.title_style, color: '#2c3e50'}}
            buttonStyle={styles.edit_button}
            onPress={navigateToChatRoom}
          />
        )}
      </View>
      <View style={styles.introduce}>
        {!!user.introduce && <Text>{user.introduce}</Text>}
      </View>
      {postProcess && (
        <View style={styles.postProcess}>
          <ActivityIndicator size="small" />
          <Text style={{marginLeft: 10, color: '#999999'}}>投稿中です</Text>
        </View>
      )}
      <Posts posts={posts} navigateToShowPost={navigateToPost} />
    </ScrollView>
  );
};

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  name_box: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3%',
  },
  name: {
    fontSize: 17,
    marginTop: 10,
  },
  edit: {
    alignItems: 'center',
    marginTop: '5%',
    height: 40,
  },
  edit_button: {
    backgroundColor: 'transparent',
  },
  title_style: {
    color: '#4fa9ff',
    fontWeight: 'bold',
  },
  introduce: {
    minHeight: height / 5,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: '3%',
  },
  introduce_text: {
    fontSize: 16,
  },
  postProcess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    marginBottom: 5,
  },
  dummy: {
    height: width / 3,
  },
});
