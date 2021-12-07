import React, {useState, useLayoutEffect, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
import fs from 'react-native-fs';
import {MenuView} from '@react-native-menu/menu';
import {RNToasty} from 'react-native-toasty';
import {RootNavigationProp} from '~/navigations/Root';
import {SnsList} from '~/types';
import {Avatar} from './Avatar';
import {BackGroundItem} from './BackGroundItem';
import {SnsIconList} from './SnsIconList';
import {SnsModal} from './SnsModal';
import {getExtention} from '~/utils';
import {
  useEditProfile,
  useMyName,
  useMyAvatar,
  useMyIntroduce,
  useMyStatusMessage,
  useMyBackGroundItem,
  useMySNSData,
} from '~/hooks/users';
import {defaultTheme} from '~/theme';

const EditItem = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) => {
  return (
    <Pressable style={styles.editElenentContainer} onPress={onPress}>
      <Text style={styles.elementLabel}>{label}</Text>
      <Text style={styles.element}>{value}</Text>
    </Pressable>
  );
};

export const UserEditPage = () => {
  const [name, setName] = useState(useMyName());

  const _introduce = useMyIntroduce();
  const [introduce, setIntroduce] = useState(_introduce ? _introduce : '');
  const displayedIntroduce = useMemo(() => {
    if (introduce.length > 12) {
      return introduce.substr(0, 11) + ' ...';
    }

    if (introduce.split('\n')[1]) {
      return introduce.split('\n')[0] + ' ...';
    }

    return introduce;
  }, [introduce]);

  const _message = useMyStatusMessage();
  const [message, setMessage] = useState(_message ? _message : '');
  const {
    instagram: _instagram,
    twitter: _twitter,
    tiktok: _tiktok,
    youtube: _youtube,
  } = useMySNSData();

  const navigation = useNavigation<RootNavigationProp<'UserEdit'>>();

  const [instagram, setInstagram] = useState<string | null>(_instagram);
  const [twitter, setTwitter] = useState<string | null>(_twitter);
  const [tiktok, setTiktok] = useState<string | null>(_tiktok);
  const [youtube, setYoutube] = useState<string | null>(_youtube);
  const [snsModalType, setSnsModalType] = useState<null | SnsList>(null);

  const snsModalProps = useMemo(() => {
    switch (snsModalType) {
      case 'instagram':
        return {
          text: instagram,
          setContents: setInstagram,
        };
      case 'twitter':
        return {
          text: twitter,
          setContents: setTwitter,
        };
      case 'youtube':
        return {
          text: youtube,
          setContents: setYoutube,
        };
      case 'tiktok':
        return {
          text: tiktok,
          setContents: setTiktok,
        };
      default:
        return {
          text: null,
        };
    }
  }, [snsModalType, instagram, twitter, youtube, tiktok]);

  const isFocused = useIsFocused();

  const avatar = useMyAvatar();
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>();
  const [deleteAvatar, setDeleteAvatar] = useState(false);
  const displayedAvatar = useMemo(
    () => (deleteAvatar ? null : selectedAvatar ? selectedAvatar : avatar),
    [deleteAvatar, selectedAvatar, avatar],
  );

  const pickAvatarImage = useCallback(() => {
    launchImageLibrary({mediaType: 'photo', quality: 0.7}, (response) => {
      if (response.didCancel) {
        return;
      }
      const asset = response.assets[0];
      const size = asset.fileSize;

      if (!size || size > 8000000) {
        RNToasty.Show({
          title: '8MB以下の画像にしてください',
          position: 'center',
        });
        return;
      }

      const uri = asset.uri;
      setSelectedAvatar(uri);
      if (deleteAvatar) {
        setDeleteAvatar(false);
      }
    });
  }, [deleteAvatar]);

  const deleteAvatrImage = () => {
    setDeleteAvatar(true);
  };

  const backGroundItem = useMyBackGroundItem();
  const [selectedBackGroundItem, setSelectedBackGroundItem] = useState<
    | {
        sourceType: 'image' | 'video';
        uri: string;
      }
    | undefined
  >();
  const [deleteBackGroundItem, setDeleteBackGroundItem] = useState(false);
  const displayedBackGroundItem = useMemo(() => {
    if (deleteBackGroundItem) {
      return null;
    }

    if (selectedBackGroundItem) {
      return selectedBackGroundItem;
    } else {
      return {
        uri: backGroundItem?.url ? backGroundItem?.url : null,
        sourceType: backGroundItem?.type ? backGroundItem?.type : null,
      };
    }
  }, [deleteBackGroundItem, selectedBackGroundItem, backGroundItem]);

  const pickBackGraoundItem = useCallback(() => {
    launchImageLibrary({mediaType: 'mixed', quality: 0.7}, (response) => {
      if (response.didCancel) {
        return;
      }

      const asset = response.assets[0];
      const uri = asset.uri;
      const _type = asset.type;
      const duration = asset.duration;

      if (!uri) {
        return;
      }

      // 選択したのが画像の場合typeは存在し、動画の場合は存在しない。
      if (_type) {
        const size = asset.fileSize;
        if (!size || size > 8000000) {
          RNToasty.Show({
            title: '8MB以下の画像にしてください',
            position: 'center',
          });
          return;
        }
        setSelectedBackGroundItem({
          sourceType: 'image',
          uri,
        });
      } else {
        if (!duration || duration > 30) {
          RNToasty.Show({
            title: '30秒以下の動画にしてください',
            position: 'center',
          });
          return;
        }
        setSelectedBackGroundItem({
          sourceType: 'video',
          uri,
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

  const {editUser, isLoading} = useEditProfile();

  const update = useCallback(async () => {
    const avatarExt = getExtention(selectedAvatar);
    const backGroundItemExt = getExtention(selectedBackGroundItem?.uri);
    const base64 = await Promise.all([
      selectedAvatar && fs.readFile(selectedAvatar, 'base64'),
      selectedBackGroundItem &&
        fs.readFile(selectedBackGroundItem.uri, 'base64'),
    ]);

    await editUser({
      name,
      introduce,
      avatar: base64[0],
      avatarExt,
      message,
      deleteAvatar,
      backGroundItem: base64[1],
      backGroundItemType: selectedBackGroundItem?.sourceType,
      backGroundItemExt,
      deleteBackGroundItem,
      instagram,
      twitter,
      tiktok,
      youtube,
    });

    navigation.goBack();
  }, [
    editUser,
    navigation,
    name,
    introduce,
    message,
    selectedAvatar,
    deleteAvatar,
    deleteBackGroundItem,
    selectedBackGroundItem,
    instagram,
    twitter,
    youtube,
    tiktok,
  ]);

  useLayoutEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        title: 'プロフィールを編集',
        headerRight: () =>
          !isLoading ? (
            <Button
              title="完了"
              titleStyle={styles.completeButtonTitle}
              buttonStyle={styles.completeButton}
              onPress={update}
              activeOpacity={1}
            />
          ) : (
            <ActivityIndicator style={{paddingRight: 10}} />
          ),
      });
    }
  }, [isFocused, isLoading, update, navigation]);

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
            url={displayedBackGroundItem ? displayedBackGroundItem.uri : null}
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
          <EditItem
            label="名前"
            value={name}
            onPress={() => {
              navigation.navigate('UserEditForm', {
                type: '名前',
                value: name,
                setValue: setName,
              });
            }}
          />
          <EditItem
            label="自己紹介"
            value={displayedIntroduce}
            onPress={() => {
              navigation.navigate('UserEditForm', {
                type: '自己紹介',
                value: introduce,
                setValue: setIntroduce,
              });
            }}
          />
          <EditItem
            label="ステータスメッセージ"
            value={message}
            onPress={() => {
              navigation.navigate('UserEditForm', {
                type: 'ステータスメッセージ',
                value: message,
                setValue: setMessage,
              });
            }}
          />
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
    backgroundColor: defaultTheme.imageBackGroundColor,
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
    marginTop: 20,
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
    width: 80,
  },
  element: {
    position: 'absolute',
    left: 100,
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: 'transparent',
  },
  completeButtonTitle: {
    color: defaultTheme.pinkGrapefruit,
    fontWeight: 'bold',
  },
  snsIconContainer: {
    marginTop: 40,
    alignSelf: 'flex-start',
    width: '75%',
  },
});
