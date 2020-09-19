import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';

import {useLogin} from '../hooks/useLogin';
import {Hooter} from '../components/Hooter';
import {UserProfileTable} from './UserProfileTable';
import {UserEditTable} from './UserEditTable';
import {MenuBar} from '../components/MenuBar';
import {RootState} from '../redux/index';

export type RootStackParamList = {
  UserProfileTable: undefined;
  UserEditTable: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const Root = () => {
  const login = useSelector((state: RootState) => {
    return state.userReducer.login;
  });
  useLogin();
  if (!login) {
    return null;
  }
  return (
    <>
      <View style={styles.container}>
        <Stack.Navigator initialRouteName="UserProfileTable">
          <Stack.Screen
            name="UserProfileTable"
            component={UserProfileTable}
            options={{
              title: 'マイページ',
              animationEnabled: false,
              headerBackTitleVisible: false,
              headerRight: () => <MenuBar />,
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name="UserEditTable"
            component={UserEditTable}
            options={{
              title: 'プロフィール編集',
              //animationEnabled: false,
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
