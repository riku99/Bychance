import React, {useEffect, useRef, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import {SearchUsers} from './SearchUsers';
import {FlashesWithUser} from '../Flashes/ShowFlash';
import {RootState, AppDispatch} from '../../../redux/index';
import {AnotherUser} from '../../../redux/types';
import {selectGetUsersArray} from '../../../redux/getUsers';
import {getOtherUsersThunk} from '../../../actions/otherUsers';
import {
  SearchUsersStackNavigationProp,
  RootNavigationProp,
} from '../../../screens/types';

export const SearchUsersPage = () => {
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

  const otherUsers = useSelector((state: RootState) => {
    return selectGetUsersArray(state);
  }, shallowEqual);

  useEffect(() => {
    if (isFocused) {
      dispatch(
        getOtherUsersThunk({lat: position.lat, lng: position.lng, range}),
      );
    }
  }, [dispatch, isFocused, position.lat, position.lng, range]);

  useEffect(() => {
    if (otherUsers.length) {
      const otherUsersWithFlashes = otherUsers.filter(
        (f) => f.flashes.entities.length,
      );
      if (otherUsersWithFlashes.length) {
        const _flashesWithUser = otherUsersWithFlashes.map((user) => {
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
  }, [otherUsers]);

  const searchStackNavigation = useNavigation<
    SearchUsersStackNavigationProp<'SearchUsers'>
  >();

  const rootStackNavigation = useNavigation<RootNavigationProp<'Tab'>>();

  const pushProfile = (user: AnotherUser) => {
    searchStackNavigation.push('UserPage', {
      userId: user.id,
      from: 'searchUsers',
    });
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
    await dispatch(
      getOtherUsersThunk({lat: position.lat, lng: position.lng, range}),
    );
    setRefreshing(false);
  };

  return (
    <SearchUsers
      otherUsers={otherUsers}
      refRange={_range}
      setRange={setRange}
      refreshing={refreshing}
      onRefresh={onRefresh}
      navigateToProfile={pushProfile}
      navigateToFlashes={pushFlashes}
    />
  );
};
