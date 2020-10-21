import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootState} from '../../redux/index';
import {UserEdit} from '../../components/users/UserEdit';
import {editProfileAction} from '../../actions/users';
import {AppDispatch} from '../../redux/index';
import {RootStackParamList} from '../../screens/Root';

type NavigationProp = StackNavigationProp<RootStackParamList, 'UserEdit'>;

export const Container = () => {
  const user = useSelector((state: RootState) => {
    return {
      id: state.userReducer.user!.id,
      name: state.userReducer.user!.name,
      introduce: state.userReducer.user!.introduce,
      image: state.userReducer.user!.image,
      message: state.userReducer.user!.message,
    };
  });
  const dispatch: AppDispatch = useDispatch();
  const navigation: NavigationProp = useNavigation();
  return (
    <UserEdit
      user={user}
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
