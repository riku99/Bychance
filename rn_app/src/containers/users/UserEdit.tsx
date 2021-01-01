import React, {useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootState, AppDispatch} from '../../redux/index';
import {UserEdit} from '../../components/users/UserEdit';
import {editProfileThunk} from '../../actions/users';
import {resetEditData} from '../../redux/user';
import {RootStackParamList} from '../../screens/Root';
import {UserEditStackParamList} from '../../screens/UserEdit';
import {displayShortMessage} from '../../helpers/shortMessage';
import {alertSomeError} from '../../helpers/error';

type NavigationProp = StackNavigationProp<RootStackParamList, 'UserEdit'>;

export type UserEditNavigationProp = StackNavigationProp<
  UserEditStackParamList,
  'EditContents'
>;

export const Container = () => {
  const user = useSelector((state: RootState) => {
    return {
      id: state.userReducer.user!.id,
      name: state.userReducer.user!.name,
      introduce: state.userReducer.user!.introduce,
      image: state.userReducer.user!.image,
      message: state.userReducer.user!.message,
    };
  }, shallowEqual);

  const savedEditData = useSelector((state: RootState) => {
    return state.userReducer.temporarilySavedData;
  }, shallowEqual);

  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const userEditNavigation = useNavigation<UserEditNavigationProp>();

  useEffect(() => {
    const unsbscribe = navigation.addListener('blur', () => {
      dispatch(resetEditData());
    });
    return unsbscribe;
  }, [navigation, dispatch]);

  const editProfile = async ({
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
        image: selectedImage,
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
  };

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

  return (
    <UserEdit
      user={user}
      savedEditData={savedEditData}
      navigateToNameEdit={navigateToNameEditPage}
      navigateToIntroduceEdit={navigateToIntroduceEditPage}
      navigateToStatusMessageEdit={navigateToStatusMessageEditPage}
      navigation={userEditNavigation}
      editProfile={editProfile}
    />
  );
};
