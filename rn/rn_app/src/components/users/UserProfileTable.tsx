import React from 'react';
import {ScrollView} from 'react-native';

import UserProfile from '../../containers/users/UserProfile';
import {UserPosts} from './UserPosts';

export const UserProfileTable = () => {
  return (
    <ScrollView>
      <UserProfile />
      <UserPosts />
    </ScrollView>
  );
};
