import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Avatar, Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import ImagePicker from 'react-native-image-picker';

import {RootStackParamList} from '../../screens/Root';

type Props = {
  user: {name: string; introduce: string | null; image: string | null};
} & {redirect?: boolean} & {
  editProfile: (
    name: string,
    introduce: string,
    image: string | undefined,
  ) => void;
} & {falseRedirect: () => void};

type NavigationProp = StackNavigationProp<RootStackParamList, 'UserEditTable'>;

const options = {
  title: 'プロフィール画像を変更',
  cancelButtonTitle: 'キャンセル',
  takePhotoButtonTitle: '写真をとる',
  chooseFromLibraryButtonTitle: 'ライブラリから選択',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  allowsEditing: true,
};

export const UserEdit = ({
  user,
  redirect,
  editProfile,
  falseRedirect,
}: Props) => {
  const [name, setName] = useState(user.name);
  const [introduce, setIntroduce] = useState(
    user.introduce ? user.introduce : '',
  );
  const [loading, setLoding] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (redirect) {
      navigation.push('UserProfileTable');
      falseRedirect();
      setLoding(false);
    }
  }, [redirect, navigation, falseRedirect]);

  const pickImage = useCallback(() => {
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.uri) {
        const source = 'data:image/jpeg;base64,' + response.data;
        setSelectedImage(source);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.edit}>
        <View style={styles.image}>
          <Avatar
            rounded
            source={
              selectedImage
                ? {uri: selectedImage}
                : user.image
                ? {uri: user.image}
                : require('../../assets/ojisan.jpg')
            }
            size="large"
            placeholderStyle={{backgroundColor: 'transeparent'}}
          />
          <Button
            title="プロフィール画像を変更"
            titleStyle={styles.imageButtonTitle}
            buttonStyle={styles.imageButton}
            onPress={() => {
              pickImage();
            }}
          />
        </View>
        <View style={styles.name}>
          <Text style={styles.nameLabel}>名前</Text>
          {name.length > 20 && (
            <Text style={{color: 'red'}}>20文字以下にしてください</Text>
          )}
          {name.length === 0 && (
            <Text style={{color: 'red'}}>名前を入力してください</Text>
          )}
          <TextInput
            style={
              name.length <= 20 && name.length !== 0
                ? styles.nameInput
                : styles.nameInputAlert
            }
            onChangeText={(text) => {
              setName(text);
            }}>
            {name}
          </TextInput>
        </View>
        <View style={styles.introduce}>
          <Text style={styles.introduceLabel}>自己紹介</Text>
          {introduce.length > 100 && (
            <Text style={{color: 'red'}}>100文字以下にしてください</Text>
          )}
          <TextInput
            style={
              introduce.length <= 100
                ? styles.introduceInput
                : styles.introduceInputAlert
            }
            multiline={true}
            onChangeText={(text) => {
              setIntroduce(text);
            }}>
            {introduce}
          </TextInput>
        </View>
        {loading ? (
          <Button
            loading
            loadingProps={{color: '#5c94c8'}}
            buttonStyle={styles.completeButton}
          />
        ) : (
          <Button
            title={'完了'}
            titleStyle={styles.completeTitle}
            buttonStyle={styles.completeButton}
            disabledStyle={{backgroundColor: 'transparent'}}
            disabled={
              (name.length > 20 ||
                name.length === 0 ||
                introduce.length > 100) &&
              true
            }
            onPress={async () => {
              setLoding(true);
              editProfile(name, introduce, selectedImage);
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  edit: {
    display: 'flex',
    alignItems: 'center',
    width: '80%',
  },
  image: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 130,
    width: '80%',
  },
  imageButton: {
    backgroundColor: 'transparent',
  },
  imageButtonTitle: {
    color: '#4fa9ff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  name: {
    display: 'flex',
    height: 90,
    width: '100%',
    marginTop: 20,
  },
  nameLabel: {
    fontSize: 20,
  },
  nameInput: {
    fontSize: 20,
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c9c9c9',
  },
  nameInputAlert: {
    fontSize: 20,
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'red',
  },
  introduce: {
    height: 180,
    width: '100%',
    marginTop: 10,
  },
  introduceLabel: {
    fontSize: 20,
  },
  introduceInput: {
    fontSize: 15,
    marginTop: 25,
    maxHeight: '50%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#c9c9c9',
  },
  introduceInputAlert: {
    fontSize: 15,
    marginTop: 25,
    borderBottomWidth: 0.5,
    borderBottomColor: 'red',
  },
  completeButton: {
    backgroundColor: 'transparent',
  },
  completeTitle: {
    color: '#4fa9ff',
    fontWeight: 'bold',
  },
});
