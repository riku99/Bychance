import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Avatar, Button} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

type Props = {
  user: {
    id: number;
    name: string;
    introduce: string | null;
    image: string | null;
    message: string | null;
  };
} & {
  editProfile: (
    name: string,
    introduce: string,
    image: string | undefined,
    message: string,
  ) => void;
};

const options = {
  title: 'プロフィール画像を変更',
  cancelButtonTitle: 'キャンセル',
  takePhotoButtonTitle: '写真をとる',
  chooseFromLibraryButtonTitle: 'ライブラリから選択',
  quality: 0.3,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  allowsEditing: true,
};

export const UserEdit = ({
  user,

  editProfile,
}: Props) => {
  const [name, setName] = useState(user.name);
  const [introduce, setIntroduce] = useState(
    user.introduce ? user.introduce : '',
  );
  const [message, setMessage] = useState(user.message ? user.message : '');
  const [loading, setLoding] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );

  const pickImage = useCallback(() => {
    ImagePicker.showImagePicker(options, (response) => {
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
            <Text style={styles.alertLabel}>名前を入力してください</Text>
          )}
          <TextInput
            style={
              name.length <= 20 && name.length !== 0
                ? styles.nameInput
                : {...styles.nameInput, ...styles.alertInput}
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
            <Text style={styles.alertLabel}>100文字以下にしてください</Text>
          )}
          <TextInput
            style={
              introduce.length <= 100
                ? styles.introduceInput
                : {...styles.introduceInput, ...styles.alertInput}
            }
            multiline={true}
            onChangeText={(text) => {
              setIntroduce(text);
            }}>
            {introduce}
          </TextInput>
        </View>
        <View style={styles.message}>
          <Text style={styles.messageLabel}>ステータスメッセージ</Text>
          {message.length > 50 && (
            <Text style={styles.alertLabel}>50文字以下にしてください</Text>
          )}
          <TextInput
            style={
              message.length < 50
                ? styles.messageInput
                : {...styles.messageInput, ...styles.alertInput}
            }
            onChangeText={(text) => {
              setMessage(text);
            }}>
            {message}
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
                introduce.length > 100 ||
                message.length > 50) &&
              true
            }
            onPress={async () => {
              setLoding(true);
              editProfile(name, introduce, selectedImage, message);
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
    alignItems: 'center',
  },
  edit: {
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
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
    fontSize: 15,
    color: '#c9c9c9',
  },
  nameInput: {
    fontSize: 15,
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c9c9c9',
  },
  introduce: {
    height: 130,
    width: '100%',
  },
  introduceLabel: {
    fontSize: 15,
    color: '#c9c9c9',
  },
  introduceInput: {
    fontSize: 15,
    marginTop: 20,
    maxHeight: '50%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#c9c9c9',
  },
  message: {
    width: '100%',
  },
  messageLabel: {
    color: '#c9c9c9',
    fontSize: 15,
  },
  messageInput: {
    fontSize: 15,
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c9c9c9',
  },
  alertLabel: {
    color: 'red',
  },
  alertInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'red',
  },
  completeButton: {
    marginTop: '100%',
    backgroundColor: 'transparent',
  },
  completeTitle: {
    color: '#4fa9ff',
    fontWeight: 'bold',
  },
});
