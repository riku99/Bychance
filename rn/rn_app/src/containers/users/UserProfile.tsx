import React from 'react';
import {useSelector} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';

import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';
import {RootStackParamList} from '../../screens/Root';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'UserProfileTable'
>;

const Container = () => {
  const userProps = useSelector((state: RootState) => {
    return state.userReducer.user!;
  });
  return (
    <UserProfile
      name={userProps.name}
      image={userProps.image}
      introduce={userProps.introduce}
    />
  );
};

export default Container;
