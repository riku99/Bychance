import React, {useEffect, useRef, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {SearchOthers} from '../../components/others/SearchOthers';
import {RootState} from '../../redux/index';
import {AnotherUser, selectOthers} from '../../redux/others';
import {getOthersThunk} from '../../actions/others';
import {AppDispatch} from '../../redux/index';

import {RootStackParamList} from '../../screens/Root';
import {SearchStackParamList} from '../../screens/Search';

type SearchNavigationProp = StackNavigationProp<
  SearchStackParamList,
  'SearchOthers'
>;

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

export const Container = () => {
  const isFocused = useIsFocused();

  const others: AnotherUser[] = useSelector((state: RootState) => {
    return selectOthers(state);
  }, shallowEqual);

  const position = useSelector((state: RootState) => {
    const lat = state.userReducer.user!.lat;
    const lng = state.userReducer.user!.lng;
    return {lat, lng};
  }, shallowEqual);

  const _range = useRef(1);

  const [range, setRange] = useState(_range.current);

  const [haveFlashOthers, setHaveFlashOthers] = useState<
    [AnotherUser, ...AnotherUser[]] | undefined
  >(undefined);

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

  useEffect(() => {
    if (others.length) {
      const _haveFlashOthers = others.filter((f) => f.flashes.length);
      if (_haveFlashOthers.length) {
        setHaveFlashOthers(_haveFlashOthers as [AnotherUser, ...AnotherUser[]]);
      }
    }
  }, [others]);

  const searchStackNavigation = useNavigation<SearchNavigationProp>();

  const rootStackNavigation = useNavigation<RootNavigationProp>();

  const pushProfile = (user: AnotherUser) => {
    searchStackNavigation.push('OtherProfile', user);
  };

  const pushShowFlash = ({userId}: {userId: number}) => {
    const index = haveFlashOthers!.findIndex((user) => user.id === userId);
    rootStackNavigation.push('ShowFlash', {
      type: 'fromSearchPage',
      displayedList: haveFlashOthers as [AnotherUser, ...AnotherUser[]],
      index,
    });
  };

  return (
    <SearchOthers
      others={others}
      refRange={_range}
      setRange={setRange}
      pushProfile={pushProfile}
      navigateToShowFlash={pushShowFlash}
    />
  );
};
