import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import ImagePicker, {ImagePickerOptions} from 'react-native-image-picker';

import {RootState} from '../../../stores/index';
import {editProfileThunk} from '../../../apis/user/editProfile';
import {resetEditData} from '../../../stores/user';
import {
  UserEditNavigationProp,
  RootNavigationProp,
} from '../../../screens/types';
import {displayShortMessage} from '../../../helpers/shortMessages/displayShortMessage';
import {alertSomeError} from '../../../helpers/errors';
import {useSelectTamporarilySavedUserEditData} from '~/hooks/users/selector';
import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {normalStyles} from '~/constants/styles/normal';
import {Avatar} from './Avatar';
import {BackGroundItem} from './BackGroundItem';

const options: ImagePickerOptions = {
  title: 'プロフィール画像を変更',
  cancelButtonTitle: 'キャンセル',
  takePhotoButtonTitle: '写真をとる',
  chooseFromLibraryButtonTitle: 'ライブラリから選択',
  customButtons: [{title: '現在の写真を削除', name: 'delete'}],
  quality: 0.3,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  allowsEditing: true,
};

export const UserEditPage = () => {
  const user = useSelector((state: RootState) => {
    return {
      id: state.userReducer.user!.id,
      name: state.userReducer.user!.name,
      introduce: state.userReducer.user!.introduce,
      avatar: state.userReducer.user!.avatar,
      message: state.userReducer.user!.statusMessage,
      backGroundItem: state.userReducer.user!.backGroundItem,
      backGroundItemType: state.userReducer.user!.backGroundItemType,
    };
  }, shallowEqual);

  const savedEditData = useSelectTamporarilySavedUserEditData();

  const dispatch = useCustomDispatch();
  const navigation = useNavigation<RootNavigationProp<'UserEditStack'>>();
  const userEditNavigation = useNavigation<
    UserEditNavigationProp<'UserEdit'>
  >();

  useEffect(() => {
    const unsbscribe = navigation.addListener('blur', () => {
      dispatch(resetEditData());
    });
    return unsbscribe;
  }, [navigation, dispatch]);

  const editProfile = useCallback(
    async ({
      name,
      introduce,
      selectedAvatar,
      message,
      deleteAvatar,
    }: {
      name: string;
      introduce: string;
      selectedAvatar: string | undefined;
      message: string;
      deleteAvatar: boolean;
    }) => {
      const result = await dispatch(
        editProfileThunk({
          name,
          introduce,
          avatar: selectedAvatar,
          message,
          deleteAvatar,
        }),
      );
      if (editProfileThunk.fulfilled.match(result)) {
        displayShortMessage('編集しました', 'success');
      } else {
        switch (result.payload?.errorType) {
          case 'invalidError':
            displayShortMessage(result.payload.message, 'danger');
            break;
          case 'someError':
            alertSomeError();
        }
      }
      navigation.goBack();
    },
    [dispatch, navigation],
  );

  const navigateToNameEditPage = ({name}: {name: string}) =>
    userEditNavigation.push('NameEdit', {type: 'name', name});

  const navigateToIntroduceEditPage = ({introduce}: {introduce: string}) =>
    userEditNavigation.push('IntroduceEdit', {type: 'introduce', introduce});

  const navigateToStatusMessageEditPage = ({
    statusMessage,
  }: {
    statusMessage: string;
  }) =>
    userEditNavigation.push('StatusMessageEdit', {
      type: 'statusMessage',
      statusMessage,
    });

  const [name, setName] = useState(user.name);
  const [introduce, setIntroduce] = useState(
    user.introduce ? user.introduce : '',
  );
  const [message, setMessage] = useState(user.message ? user.message : '');
  const [loading, setLoding] = useState(false);

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

  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(
    undefined,
  );
  const [deleteAvatar, setDeleteAvatar] = useState(false);
  const displayedAvatar = useMemo(
    () => (deleteAvatar ? null : selectedAvatar ? selectedAvatar : user.avatar),
    [deleteAvatar, selectedAvatar, user.avatar],
  );

  const pickAvatarImage = useCallback(() => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.customButton === 'delete') {
        setDeleteAvatar(true);
        return;
      }
      if (response.uri) {
        const source = 'data:image/jpeg;base64,' + response.data;
        setSelectedAvatar(source);
        if (deleteAvatar) {
          setDeleteAvatar(false);
        }
      }
    });
  }, [deleteAvatar]);

  useLayoutEffect(() => {
    if (isFocused) {
      navigation.dangerouslyGetParent()?.setOptions({
        title: 'プロフィールを編集',
        headerRight: () =>
          !loading ? (
            <Button
              title="完了"
              titleStyle={styles.completeButtonTitle}
              buttonStyle={styles.completeButton}
              onPress={() => {
                setLoding(true);
                editProfile({
                  name,
                  introduce,
                  selectedAvatar,
                  message,
                  deleteAvatar,
                });
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
    selectedAvatar,
    deleteAvatar,
    isFocused,
    loading,
  ]);

  const [backGroundItem, setBackGroundItem] = useState(user.backGroundItem);
  const [backGroundItemType, setBackGroundType] = useState(
    user.backGroundItemType,
  );
  const pickBackGraoundItem = useCallback(() => {
    ImagePicker.launchImageLibrary(
      {mediaType: 'mixed', quality: 0.3},
      (response) => {
        if (response.didCancel) {
          return;
        }

        setBackGroundItem(response.uri);

        if (response.type) {
          setBackGroundType('image');
        } else {
          setBackGroundType('video');
        }
      },
    );
  }, []);
  const deleteBackGroundItem = useCallback(() => {
    Alert.alert('背景を削除', '削除してよろしいですか?', [
      {
        text: 'はい',
        onPress: () => {
          setBackGroundItem(null);
          setBackGroundType(null);
        },
      },
      {
        text: 'いいえ',
      },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.backGraondItemContainer}>
        <BackGroundItem
          source={backGroundItem}
          type={backGroundItemType}
          onPress={pickBackGraoundItem}
          onDeletePress={deleteBackGroundItem}
        />
      </View>
      <View style={styles.avatarContainer}>
        <Avatar avatar={displayedAvatar} onPress={pickAvatarImage} />
      </View>
      <View style={styles.mainEditContainer}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.editElenentContainer}
            onPress={() => {
              navigateToNameEditPage({
                name,
              });
            }}>
            <Text style={styles.elementLabel}>名前</Text>
            <Text style={styles.element}>{name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editElenentContainer}
            onPress={() => {
              navigateToIntroduceEditPage({
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
              navigateToStatusMessageEditPage({
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
  },
  backGraondItemContainer: {
    width: '100%',
    height: '20%',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: '15%',
    left: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainEditContainer: {
    width: '90%',
    height: '90%',
    display: 'flex',
    alignItems: 'center',
    marginTop: '15%',
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
    color: normalStyles.mainTextColor,
  },
  completeButton: {
    backgroundColor: 'transparent',
  },
  completeButtonTitle: {
    color: normalStyles.blueText,
    fontWeight: 'bold',
  },
});
