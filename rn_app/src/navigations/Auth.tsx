import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import {Auth} from '~/components/screens/Auth';
import {TermsOfUse} from '~/components/utils/TermsOfUse';
import {PrivacyPolicy} from '~/components/utils/PrivacyPolicy';
import {SignUp} from '~/components/screens/SignUp';
import {AuthCode} from '~/components/screens/AuthCode';

export type AuthStackParamList = {
  Auth: undefined;
  TermsOfUse: undefined;
  PrivacyPolicy: undefined;
  SignUp: undefined;
  AuthCode: undefined;
};

export type AuthNavigationProp<
  T extends keyof AuthStackParamList
> = StackNavigationProp<AuthStackParamList, T>;

const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthStackScreen = React.memo(() => {
  return (
    <AuthStack.Navigator
      mode="modal"
      screenOptions={{
        headerBackTitleVisible: false,
      }}>
      <AuthStack.Screen
        name="Auth"
        component={Auth}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="TermsOfUse"
        component={TermsOfUse}
        options={{
          headerTitle: '利用規約',
        }}
      />
      <AuthStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          headerTitle: 'プライバシーポリシー',
        }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal',
        }}
      />
      <AuthStack.Screen
        name="AuthCode"
        component={AuthCode}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal',
        }}
      />
    </AuthStack.Navigator>
  );
});
