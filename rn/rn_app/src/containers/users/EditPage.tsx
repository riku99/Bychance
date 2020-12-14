import React from 'react';
import {useDispatch} from 'react-redux';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {EditPage} from '../../components/users/EditPage';
import {UserEditStackParamList} from '../../screens/UserEdit';
import {saveEditData} from '../../redux/user';

type UserEditRouteProp = RouteProp<
  UserEditStackParamList,
  'NameEdit' | 'IntroduceEdit' | 'StatusMessageEdit'
>;

type Props = {route: UserEditRouteProp};

export type UserEditNavigationProp = StackNavigationProp<
  UserEditStackParamList,
  'NameEdit' | 'IntroduceEdit' | 'StatusMessageEdit'
>;

export const Container = ({route}: Props) => {
  const dispatch = useDispatch();
  const userEditNavigation = useNavigation<UserEditNavigationProp>();

  return (
    <EditPage
      name={route.params.type === 'name' ? route.params.name : undefined}
      introduce={
        route.params.type === 'introduce' ? route.params.introduce : undefined
      }
      statusMessage={
        route.params.type === 'statusMessage'
          ? route.params.statusMessage
          : undefined
      }
      saveEditData={({
        name,
        introduce,
        statusMessage,
      }: {
        name?: string;
        introduce?: string;
        statusMessage?: string;
      }) => {
        dispatch(saveEditData({name, introduce, statusMessage}));
        userEditNavigation.goBack();
      }}
      navigation={userEditNavigation}
    />
  );
};
