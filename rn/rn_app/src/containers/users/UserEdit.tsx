import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../redux/index';
import {UserEdit} from '../../components/users/UserEdit';
import {editProfileAction} from '../../actions/users_action';
import {falseRedirect} from '../../redux/user';

const Container = () => {
  const userProps = useSelector((state: RootState) => {
    return {
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
      // これを実行するとPromiseを返す
      // てことはこれをPromiseを返す関数であることをtsで定義したい
      // connectのときはReturntypeでできた
      editProfile={(name: string, introduce: string) => {
        dispatch(editProfileAction({name, introduce}));
      }}
      falseRedirect={() => {
        dispatch(falseRedirect());
      }}
    />
  );
};

export default Container;
