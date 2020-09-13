import React from 'react';
import {useSelector} from 'react-redux';

import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';

const Container = () => {
  const {name, image, introduce} = useSelector((state: RootState) => {
    return state.userReducer.user!;
  });
  return <UserProfile name={name} image={image} introduce={introduce} />;
};

export default Container;
