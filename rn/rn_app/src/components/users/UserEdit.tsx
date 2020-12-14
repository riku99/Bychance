import React, {useCallback, useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

import {UserAvatar} from '../utils/Avatar';
import {basicStyles} from '../../constants/styles';
import {UserEditNavigationProp} from '../../containers/users/UserEdit';
import {MyTheme} from '../../App';

type Props = {
  user: {
    id: number;
    name: string;
    introduce: string | null;
    image: string | null;
    message: string | null;
  };
  savedEditData?: {
    name?: string;
    introduce?: string;
    statusMessage?: string;
  };
  navigateToNameEdit: ({name}: {name: string}) => void;
  navigateToIntroduceEdit: ({introduce}: {introduce: string}) => void;
  navigateToStatusMessageEdit: ({
    statusMessage,
  }: {
    statusMessage: string;
  }) => void;
  editProfile: (
    name: string,
    introduce: string,
    image: string | undefined,
    message: string,
  ) => void;
  navigation: UserEditNavigationProp;
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
  savedEditData,
  navigateToNameEdit,
  navigateToIntroduceEdit,
  navigateToStatusMessageEdit,
  editProfile,
  navigation,
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

  const isFocused = useIsFocused();

  useEffect(() => {
    if (savedEditData?.name) {
      setName(savedEditData?.name);
    }
    if (savedEditData?.introduce || savedEditData?.introduce === '') {
      const _data = savedEditData.introduce.replace(/\n{2,}/g, '\n');
      setIntroduce(_data);
    }
    if (savedEditData?.statusMessage || savedEditData?.statusMessage === '') {
      setMessage(savedEditData.statusMessage);
    }
  }, [savedEditData]);

  useLayoutEffect(() => {
    if (isFocused) {
      navigation.dangerouslyGetParent()?.setOptions({
        title: 'プロフィールを編集',
        headerRight: () =>
          !loading ? (
            <Button
              title="完了"
              titleStyle={{color: MyTheme.colors.text, fontWeight: 'bold'}}
              buttonStyle={{backgroundColor: 'transparent'}}
              onPress={() => {
                setLoding(true);
                editProfile(name, introduce, selectedImage, message);
              }}
            />
          ) : (
            <ActivityIndicator />
          ),
      });
    }
  }, [
    navigation,
    editProfile,
    name,
    introduce,
    message,
    selectedImage,
    isFocused,
    loading,
  ]);

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
      <View style={styles.mainEditContainer}>
        <View style={styles.image}>
          <UserAvatar
            image={selectedImage ? selectedImage : user.image}
            size="large"
            opacity={1}
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
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.editElenentContainer}
            onPress={() => {
              navigateToNameEdit({
                name,
              });
            }}>
            <Text style={styles.elementLabel}>名前</Text>
            <Text style={styles.element}>{name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editElenentContainer}
            onPress={() => {
              navigateToIntroduceEdit({
                introduce,
              });
            }}>
            <Text style={styles.elementLabel}>自己紹介</Text>
            <Text style={styles.element}>
              {introduce && introduce !== ''
                ? introduce.split('\n')[1]
                  ? introduce.split('\n')[0] + ' ...'
                  : introduce
                : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editElenentContainer}
            onPress={() =>
              navigateToStatusMessageEdit({
                statusMessage: message,
              })
            }>
            <Text style={styles.elementLabel}>ステータス{'\n'}メッセージ</Text>
            <Text style={styles.element}>{message}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const labelColor = '#a3a3a3';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainEditContainer: {
    width: '90%',
    height: '90%',
    display: 'flex',
    alignItems: 'center',
  },
  profileContainer: {
    width: '100%',
    height: 200,
    marginTop: 15,
  },
  editElenentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  elementLabel: {
    fontSize: 16,
    color: labelColor,
  },
  element: {
    position: 'absolute',
    left: 100,
    fontSize: 16,
    color: basicStyles.mainTextColor,
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
  completeButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  completeTitle: {
    color: '#4fa9ff',
    fontWeight: 'bold',
  },
});
