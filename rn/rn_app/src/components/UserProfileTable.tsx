import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';

import {UserProfile} from './users/UserProfile';
import {UserPosts} from './users/UserPosts';

export const UserProfileTable = () => {
  return (
    <ScrollView>
      <UserProfile />
      <UserPosts />
    </ScrollView>
  );
};

//const {height} = Dimensions.get('window');
export const styles = StyleSheet.create({});
