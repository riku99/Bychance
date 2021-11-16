import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {Auth} from '~/components/screens/Auth';
import {TermsOfUse} from '~/components/utils/TermsOfUse';
import {PrivacyPolicy} from '~/components/utils/PrivacyPolicy';
import {SignUp} from '~/components/screens/SignUp';
import {SignIn} from '~/components/screens/SignIn';
import {AuthCode} from '~/components/screens/AuthCode';

export type AuthStackParamList = {
  Auth: undefined;
  TermsOfUse: undefined;
  PrivacyPolicy: undefined;
  SignUp: undefined;
  SignIn: undefined;
  AuthCode: {
    name: string;
    email: string;
    password: string;
  };
};

export type AuthNavigationProp<
  T extends keyof AuthStackParamList
> = StackNavigationProp<AuthStackParamList, T>;

export type AuthRouteProp<T extends keyof AuthStackParamList> = RouteProp<
  AuthStackParamList,
  T
>;

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
        name="SignIn"
        component={SignIn}
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
