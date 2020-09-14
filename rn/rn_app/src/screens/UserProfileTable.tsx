import React from 'react';
import {ScrollView} from 'react-native';

import UserProfile from '../containers/users/UserProfile';
import {UserPosts} from '../components/users/UserPosts';

export const UserProfileTable = ({navigation}: any) => {
  return (
    <ScrollView>
      <UserProfile navigation={navigation} />
      <UserPosts />
    </ScrollView>
  );
};
