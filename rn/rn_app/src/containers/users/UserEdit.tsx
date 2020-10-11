import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../redux/index';
import {UserEdit} from '../../components/users/UserEdit';
import {editProfileAction} from '../../actions/users_action';
import {falseRedirect} from '../../redux/user';

const Container = () => {
  const userProps = useSelector((state: RootState) => {
    return {
      id: state.userReducer.user!.id,
      name: state.userReducer.user!.name,
      introduce: state.userReducer.user!.introduce,
      image: state.userReducer.user!.image,
    };
  });
  const redirect = useSelector((state: RootState) => {
    return state.userReducer.redirect;
  });
  const dispatch = useDispatch();
  return (
    <UserEdit
      user={userProps}
      redirect={redirect}
      editProfile={(
        name: string,
        introduce: string,
        image: string | undefined,
      ) => {
        dispatch(editProfileAction({name, introduce, image}));
      }}
      falseRedirect={() => {
        dispatch(falseRedirect());
      }}
    />
  );
};

export default Container;
