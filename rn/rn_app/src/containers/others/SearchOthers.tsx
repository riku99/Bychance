import React, {useEffect, useRef, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {SearchOthers} from '../../components/others/SearchOthers';
import {FlashData} from '../../components/flashes/ShowFlash';
import {RootState} from '../../redux/index';
import {AnotherUser, selectOthers} from '../../redux/others';
import {AppDispatch} from '../../redux/index';
import {getOthersThunk} from '../../actions/others';
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

  const [flashData, setFlashData] = useState<FlashData[]>([]);

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
      const haveFlashOthers = others.filter((f) => f.flashes.length);
      if (haveFlashOthers.length) {
        const _flashData = haveFlashOthers.map((user) => {
          const {flashes, ...rest} = user;
          return {
            flashes,
            user: rest,
          };
        });
        setFlashData(_flashData);
      }
    }
  }, [others]);

  const searchStackNavigation = useNavigation<SearchNavigationProp>();

  const rootStackNavigation = useNavigation<RootNavigationProp>();

  const pushProfile = (user: AnotherUser) => {
    searchStackNavigation.push('OtherProfile', user);
  };

  const pushShowFlash = ({id}: {id: number}) => {
    const index = flashData!.findIndex((item) => item.user.id === id);
    rootStackNavigation.push('Flashes', {allFlashData: flashData, index});
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
