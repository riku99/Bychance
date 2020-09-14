import React from 'react';
import {useSelector} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';

import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';
import {RootStackParamList} from '../../screens/Root';

type NavigationProp = StackNavigationProp<RootStackParamList, 'UserProfile'>;
type props = {navigation: NavigationProp};

const Container = ({navigation}: props) => {
  const userProps = useSelector((state: RootState) => {
    return state.userReducer.user!;
  });
  const goToEditPage = () => {
    navigation.push('UserEdit');
  };
  return (
    <UserProfile
      name={userProps.name}
      image={userProps.image}
      introduce={userProps.introduce}
      navigation={{goToEditPage: goToEditPage}}
    />
  );
};

export default Container;
