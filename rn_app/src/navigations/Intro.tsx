import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {Intro} from '~/components/screens/Intro';
import {PrivateConfig} from '~/components/screens/PrivateConfig';

export type IntroStackParamList = {
  Intro: undefined;
  PrivateConfig: {
    goTo: 'zone' | 'time';
  };
};

const Stack = createStackNavigator<IntroStackParamList>();

export const IntroStackScreen = React.memo(() => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="Intro"
        component={Intro}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="PrivateConfig" component={PrivateConfig} />
    </Stack.Navigator>
  );
});
