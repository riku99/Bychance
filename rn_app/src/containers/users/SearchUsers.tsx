import React, {useEffect, useRef, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {SearchUsers} from '../../components/users/SearchUsers';
import {FlashesWithUser} from '../../components/flashes/ShowFlash';
import {RootState} from '../../redux/index';
import {AnotherUser} from '../../components/users/SearchUsers';
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

  const position = useSelector((state: RootState) => {
    const lat = state.userReducer.user!.lat;
    const lng = state.userReducer.user!.lng;
    return {lat, lng};
  }, shallowEqual);

  const _range = useRef(0.1);

  const [range, setRange] = useState(_range.current);

  const [flashesWithUser, setFlashesWithUser] = useState<FlashesWithUser[]>([]);

  const [
    containedNotAlreadyViewdFlashes,
    setContainedNotAlreadyViewdFlashes,
  ] = useState<FlashesWithUser[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  const [others, setOthers] = useState<AnotherUser[]>([]);

  // API通信が成功した場合、そのデータはdispatchされる必要はないが
  // エラーハンドリングでdispatchが必要なのでthunkで通信を行う
  useEffect(() => {
    const getOthers = async (range: number) => {
      if (isFocused) {
        const result = await dispatch(
          getOthersThunk({lat: position.lat, lng: position.lng, range}),
        );
        if (getOthersThunk.fulfilled.match(result)) {
          setOthers(result.payload);
        }
      }
    };
    getOthers(range);
  }, [dispatch, isFocused, position.lat, position.lng, range]);

  useEffect(() => {
    if (others.length) {
      const othersWithFlashes = others.filter((f) => f.flashes.entities.length);
      if (othersWithFlashes.length) {
        const _flashesWithUser = othersWithFlashes.map((user) => {
          const {flashes, ...rest} = user;
          return {
            flashes,
            user: rest,
          };
        });
        const _containedNotAlreadyViewdFlashes = _flashesWithUser.filter(
          (item) => !item.flashes.isAllAlreadyViewed,
        );
        setFlashesWithUser(_flashesWithUser);
        setContainedNotAlreadyViewdFlashes(_containedNotAlreadyViewdFlashes);
      }
    }
  }, [others]);

  const searchStackNavigation = useNavigation<SearchNavigationProp>();

  const rootStackNavigation = useNavigation<RootNavigationProp>();

  const pushProfile = (user: AnotherUser) => {
    searchStackNavigation.push('Profile', user);
  };

  const pushFlashes = ({
    id,
    isAllAlreadyViewed,
  }: {
    id: number;
    isAllAlreadyViewed?: boolean;
  }) => {
    let index: number;
    let singleEntity: FlashesWithUser[];
    if (isAllAlreadyViewed) {
      index = 0;
      singleEntity = flashesWithUser.filter((item) => item.user.id === id);
    } else {
      index = containedNotAlreadyViewdFlashes!.findIndex(
        (item) => item.user.id === id,
      );
    }
    rootStackNavigation.push('Flashes', {
      screen: 'showFlashes',
      params: {
        allFlashesWithUser: isAllAlreadyViewed
          ? singleEntity!
          : containedNotAlreadyViewdFlashes,
        index,
      },
    });
  };

  const onRefresh = async (range: number) => {
    setRefreshing(true);
    const result = await dispatch(
      getOthersThunk({lat: position.lat, lng: position.lng, range}),
    );
    if (getOthersThunk.fulfilled.match(result)) {
      setOthers(result.payload);
    }
    setRefreshing(false);
  };

  return (
    <SearchUsers
      others={others}
      refRange={_range}
      setRange={setRange}
      refreshing={refreshing}
      onRefresh={onRefresh}
      navigateToProfile={pushProfile}
      navigateToFlashes={pushFlashes}
    />
  );
};
