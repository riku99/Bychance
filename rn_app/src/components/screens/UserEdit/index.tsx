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
import fs from 'react-native-fs';

import {RootNavigationProp} from '~/screens/Root';
import {RootState} from '../../../stores/index';
import {editProfileThunk} from '../../../apis/users/editProfile';
import {resetEditData} from '../../../stores/user';
import {UserEditNavigationProp} from '../../../screens/types';
import {displayShortMessage} from '../../../helpers/shortMessages/displayShortMessage';
import {useSelectTamporarilySavedUserEditData} from '~/hooks/users/selector';
import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {normalStyles} from '~/constants/styles/normal';
import {SnsList} from '~/types';
import {Avatar} from './Avatar';
import {BackGroundItem} from './BackGroundItem';
import {SnsIconList} from './SnsIconList';
import {SnsModal} from './SnsModal';

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
    const {instagram, twitter, youtube, tiktok} = state.userReducer.user!;
    return {
      id: state.userReducer.user!.id,
      name: state.userReducer.user!.name,
      introduce: state.userReducer.user!.introduce,
      avatar: state.userReducer.user!.avatar,
      message: state.userReducer.user!.statusMessage,
      backGroundItem: state.userReducer.user!.backGroundItem,
      backGroundItemType: state.userReducer.user!.backGroundItemType,
      instagram,
      twitter,
      tiktok,
      youtube,
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

  const [instagram, setInstagram] = useState<string | null>(user.instagram);
  const [twitter, setTwitter] = useState<string | null>(user.twitter);
  const [tiktok, setTiktok] = useState<string | null>(user.tiktok);
  const [youtube, setYoutube] = useState<string | null>(user.youtube);
  const [snsModal, setSnsModal] = useState<null | SnsList>(null);

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

  const [selectedBackGroundItem, setSelectedBackGroundItem] = useState<
    | {
        sourceType: 'image' | 'video';
        uri: string;
        base64?: string;
      }
    | undefined
  >();
  const [deleteBackGroundItem, setDeleteBackGroundItem] = useState(false);
  const displayedBackGroundItem = useMemo(() => {
    return deleteBackGroundItem
      ? null
      : selectedBackGroundItem
      ? {
          uri: selectedBackGroundItem.uri,
          sourceType: selectedBackGroundItem.sourceType,
        }
      : {
          uri: user.backGroundItem,
          sourceType: user.backGroundItemType,
        };
  }, [
    deleteBackGroundItem,
    selectedBackGroundItem,
    user.backGroundItem,
    user.backGroundItemType,
  ]);

  const pickBackGraoundItem = useCallback(() => {
    ImagePicker.launchImageLibrary(
      {mediaType: 'mixed', quality: 0.3},
      (response) => {
        if (response.didCancel) {
          return;
        }

        // 選択したのが画像の場合typeは存在し、動画の場合は存在しない。画像の場合は uri.data でbase64のエンコードデータを取れる
        if (response.type) {
          setSelectedBackGroundItem({
            sourceType: 'image',
            base64: response.data,
            uri: response.uri,
          });
        } else {
          setSelectedBackGroundItem({
            sourceType: 'video',
            uri: response.uri,
          });
        }
      },
    );
  }, []);

  const onDeleteBackGroundItem = useCallback(() => {
    Alert.alert('背景を削除', '削除してよろしいですか?', [
      {
        text: 'はい',
        onPress: () => {
          setSelectedBackGroundItem(undefined);
          setDeleteBackGroundItem(true);
        },
      },
      {
        text: 'いいえ',
      },
    ]);
  }, []);

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
              onPress={async () => {
                setLoding(true);
                const length =
                  selectedBackGroundItem &&
                  selectedBackGroundItem.uri.lastIndexOf('.');
                const ext =
                  length && length !== -1
                    ? selectedBackGroundItem?.uri.slice(length + 1)
                    : undefined;

                // 画像の場合はカメラロールから取得した時点でエンコードされたデータを取得できているが、動画の場合はできていないので、uriを元にエンコードデータを作成し、それを送信する
                const base64 =
                  selectedBackGroundItem &&
                  (selectedBackGroundItem.sourceType === 'image'
                    ? selectedBackGroundItem.base64
                    : await fs.readFile(selectedBackGroundItem.uri, 'base64'));

                const result = await dispatch(
                  editProfileThunk({
                    name,
                    introduce,
                    avatar: selectedAvatar,
                    message,
                    deleteAvatar,
                    backGroundItem: base64,
                    backGroundItemType: selectedBackGroundItem?.sourceType,
                    deleteBackGroundItem,
                    backGroundItemExt: ext,
                    instagram,
                    twitter,
                    tiktok,
                    youtube,
                  }),
                );

                if (editProfileThunk.fulfilled.match(result)) {
                  displayShortMessage('更新しました', 'success');
                }
                navigation.goBack();
              }}
            />
          ) : (
            <ActivityIndicator />
          ),
      });
    }
  }, [
    navigation,
    name,
    introduce,
    message,
    selectedAvatar,
    deleteAvatar,
    isFocused,
    loading,
    deleteBackGroundItem,
    selectedBackGroundItem,
    dispatch,
    instagram,
    twitter,
    youtube,
    tiktok,
  ]);

  const showSnsModal = useCallback((snsType: SnsList) => {
    setSnsModal(snsType);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.backGraondItemContainer}>
        <BackGroundItem
          source={displayedBackGroundItem ? displayedBackGroundItem.uri : null}
          type={
            displayedBackGroundItem ? displayedBackGroundItem.sourceType : null
          }
          onPress={pickBackGraoundItem}
          onDeletePress={onDeleteBackGroundItem}
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
        <View style={styles.snsIconContainer}>
          <SnsIconList showSnsModal={showSnsModal} />
        </View>
      </View>
      {snsModal && (
        <SnsModal show={snsModal} onClose={() => setSnsModal(null)} />
      )}
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
    marginTop: '10%',
  },
  profileContainer: {
    width: '100%',
    height: 200,
  },
  editElenentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
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
  snsIconContainer: {
    marginTop: 40,
    alignSelf: 'flex-start',
    width: '75%',
  },
});
