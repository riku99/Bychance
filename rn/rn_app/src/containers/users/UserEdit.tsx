import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../redux/index';
import {UserEdit} from '../../components/users/UserEdit';
import {editProfileAction} from '../../actions/users';
import {falseRedirect} from '../../redux/user';

export const Container = () => {
  const user = useSelector((state: RootState) => {
    return {
      id: state.userReducer.user!.id,
      name: state.userReducer.user!.name,
      introduce: state.userReducer.user!.introduce,
      image: state.userReducer.user!.image,
      message: state.userReducer.user!.message,
    };
  });
  const redirect = useSelector((state: RootState) => {
    return state.userReducer.redirect;
  });
  const dispatch = useDispatch();
  return (
    <UserEdit
      user={user}
      redirect={redirect}
      editProfile={(
        name: string,
        introduce: string,
        image: string | undefined,
        message: string,
      ) => {
        dispatch(editProfileAction({name, introduce, image, message}));
      }}
      falseRedirect={() => {
        dispatch(falseRedirect());
      }}
    />
  );
};
