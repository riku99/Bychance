import React, {useEffect, useRef, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {SearchOthers} from '../../components/others/SearchOthers';
import {RootState} from '../../redux/index';
import {anotherUser, selectOthers} from '../../redux/others';
import {getOthersThunk} from '../../actions/others';
import {AppDispatch} from '../../redux/index';

import {SearchStackParamList} from '../../screens/Search';

type SearchNavigationProp = StackNavigationProp<
  SearchStackParamList,
  'SearchOthers'
>;

export const Container = () => {
  const isFocused = useIsFocused();

  const others: anotherUser[] = useSelector((state: RootState) => {
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

  const navigationToProfile = useNavigation<SearchNavigationProp>();

  const pushProfile = (user: anotherUser) => {
    navigationToProfile.push('OtherProfile', user);
  };
  return (
    <SearchOthers
      others={others}
      refRange={_range}
      setRange={setRange}
      pushProfile={pushProfile}
    />
  );
};
