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
import {launchImageLibrary} from 'react-native-image-picker';
import fs from 'react-native-fs';
import {MenuView} from '@react-native-menu/menu';

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
  const [snsModalType, setSnsModalType] = useState<null | SnsList>(null);

  const snsModalProps = useMemo(() => {
    switch (snsModalType) {
      case 'instagram':
        return {
          text: user.instagram,
          setContents: setInstagram,
        };
      case 'twitter':
        return {
          text: user.twitter,
          setContents: setTwitter,
        };
      case 'youtube':
        return {
          text: user.youtube,
          setContents: setYoutube,
        };
      case 'tiktok':
        return {
          text: user.tiktok,
          setContents: setTiktok,
        };
      default:
        return {
          text: null,
        };
    }
  }, [snsModalType, user.instagram, user.twitter, user.youtube, user.tiktok]);

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
    launchImageLibrary(
      {mediaType: 'photo', quality: 0.5, includeBase64: true},
      (response) => {
        if (response.didCancel || !response.uri) {
          return;
        }
        setSelectedAvatar(response.uri);
        if (deleteAvatar) {
          setDeleteAvatar(false);
        }
      },
    );
  }, [deleteAvatar]);

  const deleteAvatrImage = () => {
    setDeleteAvatar(true);
  };

  const [selectedBackGroundItem, setSelectedBackGroundItem] = useState<
    | {
        sourceType: 'image' | 'video';
        uri: string;
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
    launchImageLibrary({mediaType: 'mixed', quality: 0.5}, (response) => {
      if (response.didCancel || !response.uri) {
        return;
      }

      // 選択したのが画像の場合typeは存在し、動画の場合は存在しない。
      if (response.type) {
        setSelectedBackGroundItem({
          sourceType: 'image',
          uri: response.uri,
        });
      } else {
        setSelectedBackGroundItem({
          sourceType: 'video',
          uri: response.uri,
        });
      }

      if (deleteBackGroundItem) {
        setDeleteBackGroundItem(false);
      }
    });
  }, [deleteBackGroundItem]);

  const onDeleteBackGroundItem = () => {
    setSelectedBackGroundItem(undefined);
    setDeleteBackGroundItem(true);
  };

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
    setSnsModalType(snsType);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.backGraondItemContainer}>
        <MenuView
          title="背景の変更"
          actions={[
            {
              id: 'pick',
              title: 'ライブラリから選択',
              image: 'photo',
            },
            {
              id: 'delete',
              title: '背景を削除',
              image: 'trash',
            },
          ]}
          onPressAction={(e) => {
            switch (e.nativeEvent.event) {
              case 'pick':
                pickBackGraoundItem();
                break;
              case 'delete':
                onDeleteBackGroundItem();
            }
          }}>
          <BackGroundItem
            source={
              displayedBackGroundItem ? displayedBackGroundItem.uri : null
            }
            type={
              displayedBackGroundItem
                ? displayedBackGroundItem.sourceType
                : null
            }
          />
        </MenuView>
      </View>
      <View style={styles.avatarContainer}>
        <MenuView
          title="プロフィール画像の変更"
          actions={[
            {
              id: 'pick',
              title: 'ライブラリから選択',
              image: 'photo',
            },
            {
              id: 'delete',
              title: 'プロフィール画像の削除',
              image: 'trash',
            },
          ]}
          onPressAction={(action) => {
            console.log(action.nativeEvent.event);
            switch (action.nativeEvent.event) {
              case 'pick':
                pickAvatarImage();
                break;
              case 'delete':
                deleteAvatrImage();
            }
          }}>
          <Avatar avatar={displayedAvatar} />
        </MenuView>
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
      {snsModalType && (
        <SnsModal
          show={snsModalType}
          onClose={() => setSnsModalType(null)}
          text={snsModalProps.text}
          setContents={snsModalProps.setContents}
        />
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
