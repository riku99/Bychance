import React, {useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootState, AppDispatch} from '../../redux/index';
import {UserEdit} from '../../components/users/UserEdit';
import {editProfileAction} from '../../actions/users';
import {resetEditData} from '../../redux/user';
import {RootStackParamList} from '../../screens/Root';
import {UserEditStackParamList} from '../../screens/UserEdit';

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

  return (
    <UserEdit
      user={user}
      savedEditData={savedEditData}
      navigateToNameEdit={({name}: {name: string}) =>
        userEditNavigation.push('NameEdit', {type: 'name', name})
      }
      navigateToIntroduceEdit={({introduce}: {introduce: string}) =>
        userEditNavigation.push('IntroduceEdit', {type: 'introduce', introduce})
      }
      navigateToStatusMessageEdit={({statusMessage}: {statusMessage: string}) =>
        userEditNavigation.push('StatusMessageEdit', {
          type: 'statusMessage',
          statusMessage,
        })
      }
      navigation={userEditNavigation}
      editProfile={async (
        name: string,
        introduce: string,
        image: string | undefined,
        message: string,
      ) => {
        await dispatch(editProfileAction({name, introduce, image, message}));
        navigation.goBack();
      }}
    />
  );
};
