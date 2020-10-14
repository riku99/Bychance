import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {Posts} from '../posts/Posts';
import {RootStackParamList} from '../../screens/Root';
import {ScrollView} from 'react-native-gesture-handler';
import {checkKeychain} from '../../helpers/keychain';
import {PostType} from '../../redux/post';

type Props = {
  user: {
    id: number;
    name: string;
    image: string | null;
    introduce: string | null;
  };
  postProcess?: boolean;
  posts: PostType[];
  setPost: (post: PostType) => void;
  navigateToShowPost: () => void;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const UserProfile = ({
  user,
  posts,
  postProcess,
  setPost,
  navigateToShowPost,
}: Props) => {
  const [keychainID, setKeychainID] = useState<null | number>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const confirmUser = async () => {
      const keychain = await checkKeychain();
      if (keychain && keychain.id === user.id) {
        setKeychainID(keychain.id);
      }
    };
    confirmUser();
  }, [user.id]);

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
        {keychainID === user.id && (
          <Button
            title="プロフィールを編集"
            titleStyle={styles.title_style}
            buttonStyle={styles.edit_button}
            onPress={() => {
              navigation.push('UserEdit');
            }}
          />
        )}
      </View>
      <View style={styles.introduce}>
        {user.introduce && <Text>{user.introduce}</Text>}
      </View>
      {postProcess && (
        <View style={styles.postProcess}>
          <ActivityIndicator size="small" />
          <Text style={{marginLeft: 10, color: '#999999'}}>投稿中です</Text>
        </View>
      )}
      <Posts
        posts={posts}
        setPost={setPost}
        navigateToShowPost={navigateToShowPost}
      />
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
    marginTop: '8%',
  },
  name_box: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3%',
  },
  name: {
    fontSize: 20,
    marginTop: 10,
  },
  edit: {
    alignItems: 'center',
    marginTop: '3%',
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
