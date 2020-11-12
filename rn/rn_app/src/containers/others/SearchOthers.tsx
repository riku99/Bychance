import React, {useEffect, useRef, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import {SearchOthers} from '../../components/others/SearchOthers';
import {RootState} from '../../redux/index';
import {OtherUserType, selectOthers} from '../../redux/others';
import {getOthersThunk} from '../../actions/others';
import {AppDispatch} from '../../redux/index';

export const Container = () => {
  const isFocused = useIsFocused();

  const others: OtherUserType[] = useSelector((state: RootState) => {
    return selectOthers(state);
  }, shallowEqual);

  const position = useSelector((state: RootState) => {
    const lat = state.userReducer.user!.lat;
    const lng = state.userReducer.user!.lng;
    return {lat, lng};
  }, shallowEqual);

  const _range = useRef(1);
  const [range, setRange] = useState(_range.current);

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    const getOthers = async (range: number) => {
      if (isFocused) {
        await dispatch(
          getOthersThunk({lat: position.lat, lng: position.lng, range}),
        );
      }
    };
    getOthers(range);
  }, [dispatch, isFocused, position.lat, position.lng, range]);
  return <SearchOthers others={others} refRange={_range} setRange={setRange} />;
};
