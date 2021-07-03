import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Auth} from '~/components/screens/Auth';

export type AuthStackParamList = {
  Auth: undefined;
  TermsOfUse: undefined;
  PrivacyPolicy: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthStackScreen = React.memo(() => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Auth"
        component={Auth}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  );
});
