import React, {useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import {SearchOthers} from '../../components/others/SearchUser';
import {RootState} from '../../redux/index';
import {OtherUserType} from '../../redux/others';
import {getOthersThunk} from '../../actions/others_action';
import {AppDispatch} from '../../redux/index';

export const Container = () => {
  const isFocused = useIsFocused();
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    const getOthers = async () => {
      if (isFocused) {
        await dispatch(getOthersThunk());
      }
    };
    getOthers();
  }, [dispatch, isFocused]);
  const others: OtherUserType[] = useSelector((state: RootState) => {
    return state.othersReducer.others!;
  }, shallowEqual);
  return <SearchOthers others={others} />;
};
