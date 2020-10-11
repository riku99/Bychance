import React from 'react';
import {useSelector} from 'react-redux';

import {UserProfile} from '../../components/users/UserProfile';
import {RootState} from '../../redux/index';

export const Container = () => {
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!;
  });
  const process = useSelector((state: RootState) => {
    return state.postReducer.process;
  });
  return (
    <UserProfile
      id={user.id}
      name={user.name}
      image={user.image}
      introduce={user.introduce}
      postProcess={process}
    />
  );
};

export default Container;
