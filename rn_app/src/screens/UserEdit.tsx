import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Container as UserEdit} from '../containers/users/UserEdit';
import {Container as EditPage} from '../containers/users/EditPage';

export type UserEditStackParamList = {
  EditContents: undefined;

  NameEdit: {type: 'name'; name: string};
  IntroduceEdit: {type: 'introduce'; introduce: string};
  StatusMessageEdit: {type: 'statusMessage'; statusMessage: string};
};

const UserEditStack = createStackNavigator<UserEditStackParamList>();

export const UserEditStackScreen = () => {
  return (
    <UserEditStack.Navigator>
      <UserEditStack.Screen name="EditContents" component={UserEdit} />
      <UserEditStack.Screen name="NameEdit" component={EditPage} />
      <UserEditStack.Screen name="IntroduceEdit" component={EditPage} />
      <UserEditStack.Screen name="StatusMessageEdit" component={EditPage} />
    </UserEditStack.Navigator>
  );
};
