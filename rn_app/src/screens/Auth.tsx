import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import {Auth} from '~/components/screens/Auth';
import {TermsOfUse} from '~/components/utils/TermsOfUse';

export type AuthStackParamList = {
  Auth: undefined;
  TermsOfUse: undefined;
  PrivacyPolicy: undefined;
};

export type AuthNavigationProp<
  T extends keyof AuthStackParamList
> = StackNavigationProp<AuthStackParamList, T>;

const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthStackScreen = React.memo(() => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Auth"
        component={Auth}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="TermsOfUse"
        component={TermsOfUse}
        options={{headerTitle: '利用規約'}}
      />
    </AuthStack.Navigator>
  );
});
