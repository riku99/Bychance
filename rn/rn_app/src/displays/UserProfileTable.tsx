import React from 'react';
import {ScrollView} from 'react-native';

import UserProfile from '../containers/users/UserProfile';
import {UserPosts} from '../components/users/UserPosts';

export const UserProfileTable = () => {
  return (
    <ScrollView>
      <UserProfile />
      <UserPosts />
    </ScrollView>
  );
};
