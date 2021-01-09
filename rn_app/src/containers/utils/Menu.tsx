import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Menu} from '../../components/utils/Menu';
import {RootState} from '../../redux/index';
import {displayMenu} from '../../redux/otherSettings';
import {editUserDisplayThunk} from '../../actions/users';

export const Container = () => {
  const isVisible = useSelector((state: RootState) => {
    return state.otherSettingsReducer.displayedMenu!;
  });
  const userDisplay = useSelector((state: RootState) => {
    return state.userReducer.user!.display;
  });

  const dispatch = useDispatch();
  const dispatchDiplayMenu = () => {
    dispatch(displayMenu());
  };
  const changeDisplay = (display: boolean) => {
    dispatch(editUserDisplayThunk(display));
  };

  return (
    <Menu
      isVisble={isVisible}
      userDisplay={userDisplay}
      displayMenu={dispatchDiplayMenu}
      changeUserDisplay={changeDisplay}
    />
  );
};
