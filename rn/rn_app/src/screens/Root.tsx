import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from 'react-native-elements';

import {useLogin} from '../hooks/useLogin';
import {CustomHeader} from '../components/Header';
import {Hooter} from '../components/Hooter';
import {UserProfileTable} from './UserProfileTable';
import {UserEditTable} from './UserEditTable';
import {MenuBar} from '../components/MenuBar';

export type RootStackParamList = {
  UserProfile: undefined;
  UserEdit: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const Root = () => {
  useLogin();
  return (
    <>
      <View style={styles.container}>
        <Stack.Navigator initialRouteName="UserProfile">
          <Stack.Screen
            name="UserProfile"
            component={UserProfileTable}
            options={{title: 'MyPage', headerRight: () => <MenuBar />}}
          />
          <Stack.Screen
            name="UserEdit"
            component={UserEditTable}
            options={{
              title: 'プロフィール編集',
              animationEnabled: false,
              headerRight: () => <MenuBar />,
            }}
          />
        </Stack.Navigator>
        <View style={styles.block}></View>
        <View style={styles.hooter}>
          <Hooter />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  block: {
    height: 50,
  },
  button: {
    backgroundColor: 'white',
  },
});

export default Root;
