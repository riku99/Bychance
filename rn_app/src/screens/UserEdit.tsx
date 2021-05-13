import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {UserEditPage} from '../components/screens/UserEdit';
import {EditUserItemPage} from '../components/screens/EditUserItem/Page';

export type UserEditStackParamList = {
  UserEdit: undefined;
  NameEdit: {type: 'name'; name: string};
  IntroduceEdit: {type: 'introduce'; introduce: string};
  StatusMessageEdit: {type: 'statusMessage'; statusMessage: string};
};

const UserEditStack = createStackNavigator<UserEditStackParamList>();

export const UserEditStackScreen = () => {
  return (
    <UserEditStack.Navigator>
      <UserEditStack.Screen name="UserEdit" component={UserEditPage} />
      <UserEditStack.Screen name="NameEdit" component={EditUserItemPage} />
      <UserEditStack.Screen name="IntroduceEdit" component={EditUserItemPage} />
      <UserEditStack.Screen
        name="StatusMessageEdit"
        component={EditUserItemPage}
      />
    </UserEditStack.Navigator>
  );
};
