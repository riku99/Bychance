import React, {useLayoutEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {AppliedGroups} from './AppliedGroups';
import {ApplyingGroups} from './ApplyingGroups';
import {RightButton} from './RightButton';

const TopTab = createMaterialTopTabNavigator();

export const ApplyingGroup = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'グループ',
      headerStyle: {shadowColor: 'transparent'},
      headerRight: () => {
        return <RightButton />;
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TopTab.Navigator
        lazy
        tabBarOptions={{pressOpacity: 1, labelStyle: {fontWeight: 'bold'}}}>
        <TopTab.Screen
          name={'申請されている\nグループ'}
          component={AppliedGroups}
        />
        <TopTab.Screen name={'申請中の\nグループ'} component={ApplyingGroups} />
        <TopTab.Screen name="現在のグループ" component={AppliedGroups} />
      </TopTab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
