import React from 'react';
import {ScrollView} from 'react-native';

import UserProfile from '../../containers/users/UserProfile';
import {Container} from '../../containers/posts/Posts'; // containerからimportする

export const UserProfileTable = () => {
  return (
    <ScrollView>
      <UserProfile />
      <Container />
    </ScrollView>
  );
};
