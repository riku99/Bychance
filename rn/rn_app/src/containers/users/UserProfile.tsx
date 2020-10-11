import React from 'react';
import {useSelector} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';

import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';
import {UserStackParamList} from '../../screens/User';

type NavigationProp = StackNavigationProp<
  UserStackParamList,
  'UserProfileTable'
>;

const Container = () => {
  const userProps = useSelector((state: RootState) => {
    return state.userReducer.user!;
  });
  const process = useSelector((state: RootState) => {
    return state.postReducer.process;
  });
  return (
    <UserProfile
      id={userProps.id}
      name={userProps.name}
      image={userProps.image}
      introduce={userProps.introduce}
      postProcess={process}
    />
  );
};

export default Container;
