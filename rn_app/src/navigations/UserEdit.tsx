import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {UserEditPage} from '../components/screens/UserEdit';
import {EditFormPage} from '~/components/screens/EditUserItem';

export type UserEditStackParamList = {
  UserEdit: undefined;
  FormPage: {type: string; value: string | null; setValue: (s: string) => void};
};

const UserEditStack = createStackNavigator<UserEditStackParamList>();

export const UserEditStackScreen = React.memo(() => {
  return (
    <UserEditStack.Navigator>
      <UserEditStack.Screen name="UserEdit" component={UserEditPage} />
      <UserEditStack.Screen name="FormPage" component={EditFormPage} />
    </UserEditStack.Navigator>
  );
});
