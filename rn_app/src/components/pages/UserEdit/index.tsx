import React, {useEffect, useState, useLayoutEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Button} from 'react-native-elements';

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
import {UserAvatar} from '~/components/utils/Avatar';

export const UserEditPage = () => {
  const user = useSelector((state: RootState) => {
    return {
      id: state.userReducer.user!.id,
      name: state.userReducer.user!.name,
      introduce: state.userReducer.user!.introduce,
      avatar: state.userReducer.user!.avatar,
      message: state.userReducer.user!.statusMessage,
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
      selectedImage,
      message,
      deleteImage,
    }: {
      name: string;
      introduce: string;
      selectedImage: string | undefined;
      message: string;
      deleteImage: boolean;
    }) => {
      const result = await dispatch(
        editProfileThunk({
          name,
          introduce,
          avatar: selectedImage,
          message,
          deleteImage,
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
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [deleteImage, setDeleteImage] = useState(false);

  const isFocused = useIsFocused();

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
                  selectedImage,
                  message,
                  deleteImage,
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
    selectedImage,
    deleteImage,
    isFocused,
    loading,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.mainEditContainer}>
        <View style={styles.image}>
          <UserAvatar
            image={
              selectedImage ? selectedImage : !deleteImage ? user.avatar : null
            }
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
    color: normalStyles.mainTextColor,
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
    backgroundColor: 'transparent',
  },
  completeButtonTitle: {
    color: normalStyles.blueText,
    fontWeight: 'bold',
  },
});
