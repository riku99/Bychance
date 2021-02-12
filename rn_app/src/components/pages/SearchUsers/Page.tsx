import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import {SearchUsers} from './SearchUsers';
import {RootState, AppDispatch} from '../../../redux/index';
import {AnotherUser} from '../../../redux/types';
import {selectGetUsersArray} from '../../../redux/getUsers';
import {getOtherUsersThunk} from '../../../actions/otherUsers';
import {
  SearchUsersStackNavigationProp,
  RootNavigationProp,
} from '../../../screens/types';
import {FlashesData} from '../Flashes/types';
import {FlashesStackParamList} from '../../../screens/Flashes';

export const SearchUsersPage = () => {
  const isFocused = useIsFocused();

  const position = useSelector((state: RootState) => {
    const lat = state.userReducer.user!.lat;
    const lng = state.userReducer.user!.lng;
    return {lat, lng};
  }, shallowEqual);

  const _range = useRef(0.1);

  const [range, setRange] = useState(_range.current);

  const getUsers = useSelector((state: RootState) => {
    return selectGetUsersArray(state);
  }, shallowEqual);

  const [refreshing, setRefreshing] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      dispatch(
        getOtherUsersThunk({lat: position.lat, lng: position.lng, range}),
      );
    }
  }, [dispatch, isFocused, position.lat, position.lng, range]);

  const searchStackNavigation = useNavigation<
    SearchUsersStackNavigationProp<'SearchUsers'>
  >();

  const rootStackNavigation = useNavigation<RootNavigationProp<'Tab'>>();

  const onListItemPress = useCallback(
    (user: AnotherUser) => {
      searchStackNavigation.push('UserPage', {
        userId: user.id,
        from: 'searchUsers',
      });
    },
    [searchStackNavigation],
  );

  // フラッシュを連続で表示(一人のを全て見たら次のユーザーのものにうつる)するためのデータ
  const sequenceFlashesAndUserData = useMemo(() => {
    if (getUsers.length) {
      const haveFlashEntitiesAndNotAllAlreadyViewedUser = getUsers.filter(
        (data) =>
          data.flashes.entities.length && !data.flashes.isAllAlreadyViewed,
      );
      const data = haveFlashEntitiesAndNotAllAlreadyViewedUser.map((user) => ({
        flashesData: user.flashes,
        userData: {userId: user.id, from: 'searchUsers'} as const,
      }));
      return data;
    }
  }, [getUsers]);

  const onAvatarPress = useCallback(
    ({
      isAllAlreadyViewed,
      userId,
      flashesData,
    }:
      | {
          isAllAlreadyViewed: true;
          userId: number;
          flashesData: FlashesData;
        }
      | {
          isAllAlreadyViewed: false;
          userId: number;
          flashesData: undefined;
        }) => {
      let navigationParams: FlashesStackParamList['Flashes'];
      // isAllAlreadyViewedがtrueであれば連続して表示せずにそのユーザーのもののみ表示させる
      // なのでこの場合はそのユーザーのデータを引数でうける
      if (isAllAlreadyViewed && flashesData) {
        navigationParams = {
          isMyData: false,
          startingIndex: 0,
          dataArray: [
            {
              flashesData: flashesData,
              userData: {userId: userId, from: 'searchUsers'},
            },
          ],
        };
        // isAllAlreadyViewedがfalseの場合他のユーザーのものも連続で表示させる必要があるのでsequenceFlashesAndUserDataを渡す
      } else if (!isAllAlreadyViewed && sequenceFlashesAndUserData) {
        const startingIndex = sequenceFlashesAndUserData!.findIndex(
          (item) => item.userData.userId === userId,
        );
        navigationParams = {
          isMyData: false,
          startingIndex,
          dataArray: sequenceFlashesAndUserData,
        };
      }
      if (navigationParams!) {
        rootStackNavigation.push('Flashes', {
          screen: 'Flashes',
          params: navigationParams!,
        });
      }
    },
    [rootStackNavigation, sequenceFlashesAndUserData],
  );

  const onRefresh = useCallback(
    async (range: number) => {
      setRefreshing(true);
      await dispatch(
        getOtherUsersThunk({lat: position.lat, lng: position.lng, range}),
      );
      setRefreshing(false);
    },
    [dispatch, position.lat, position.lng],
  );

  return (
    <SearchUsers
      otherUsers={getUsers}
      refRange={_range}
      setRange={setRange}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onListItemPress={onListItemPress}
      onAvatarPress={onAvatarPress}
    />
  );
};
