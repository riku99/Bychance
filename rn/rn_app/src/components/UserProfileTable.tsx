import React from 'react';
import {View, ScrollView, StyleSheet, Text, Dimensions} from 'react-native';

import {UserProfile} from './users/UserProfile';

export const UserProfileTable = () => {
  return (
    <ScrollView>
      <UserProfile />
      <View style={{height: 800}}></View>
    </ScrollView>
  );
};

//const {height} = Dimensions.get('window');
const styles = StyleSheet.create({});
