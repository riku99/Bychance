import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {Posts} from '../posts/Posts';
import {ScrollView} from 'react-native-gesture-handler';
import {Post} from '../../redux/post';

type Props = {
  user: {
    id: number;
    name: string;
    image: string | null;
    introduce: string | null;
  };
  keychainId: number | null;
  posts: Post[];
  navigateToPost: (post: Post) => void;
  navigateToUserEdit?: () => void;
  navigateToChatRoom?: () => Promise<void> | void;
  navigateToTakeFlash?: () => void;
};

export const UserProfile = ({
  user,
  posts,
  keychainId,
  navigateToPost,
  navigateToUserEdit,
  navigateToChatRoom,
  navigateToTakeFlash,
}: Props) => {
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.image}>
          <Avatar
            rounded
            source={
              user.image ? {uri: user.image} : require('../../assets/buta.jpg')
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
        <Posts posts={posts} navigateToShowPost={navigateToPost} />
      </ScrollView>
      {keychainId === user.id && (
        <Button
          icon={<MIcon name="flash-on" size={27} style={{color: 'white'}} />}
          containerStyle={styles.storyContainer}
          buttonStyle={styles.stroyButton}
          onPress={navigateToTakeFlash}
        />
      )}
    </>
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
    marginTop: '5%',
  },
  name: {
    fontSize: 19,
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
    fontSize: 16,
  },
  introduce: {
    minHeight: height / 5,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: '5%',
  },
  introduce_text: {
    fontSize: 16,
  },
  storyContainer: {position: 'absolute', bottom: '3%', right: '5%'},
  stroyButton: {
    width: width / 7,
    height: width / 7,
    borderRadius: width / 7,
    backgroundColor: '#1f6fff',
    opacity: 0.9,
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
