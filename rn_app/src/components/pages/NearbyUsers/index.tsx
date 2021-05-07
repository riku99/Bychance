import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import {NearbyUsersList} from './nearbyUsersMain';
import {RootState, AppDispatch} from '../../../stores/index';
import {AnotherUser} from '../../../stores/types';
import {selectNearbyUsersArray} from '../../../stores/nearbyUsers';
import {getNearbyUsersThunk} from '../../../apis/nearbyUsers/getNearbyUsers';
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

  const [range, setRange] = useState(0.1);

  const nearbyUsers = useSelector((state: RootState) => {
    return selectNearbyUsersArray(state);
  }, shallowEqual);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      dispatch(
        getNearbyUsersThunk({lat: position.lat, lng: position.lng, range}),
      );
    }
  }, [dispatch, isFocused, position.lat, position.lng, range]);

  const searchStackNavigation = useNavigation<
    SearchUsersStackNavigationProp<'SearchUsers'>
  >();

  const rootStackNavigation = useNavigation<RootNavigationProp<'Tab'>>();

  const navigateToUserPage = useCallback(
    (user: AnotherUser) => {
      searchStackNavigation.push('UserPage', {
        userId: user.id,
        from: 'nearbyUsers',
      });
    },
    [searchStackNavigation],
  );

  // フラッシュを連続で表示(一人のを全て見たら次のユーザーのものにうつる)するためのデータ
  const sequenceFlashesAndUserData = useMemo(() => {
    if (nearbyUsers.length) {
      const haveFlashEntitiesAndNotAllAlreadyViewedUser = nearbyUsers.filter(
        (data) =>
          data.flashes.entities.length && !data.flashes.isAllAlreadyViewed,
      );
      const data = haveFlashEntitiesAndNotAllAlreadyViewedUser.map((user) => ({
        flashesData: user.flashes,
        userData: {userId: user.id, from: 'nearbyUsers'} as const,
      }));
      return data;
    }
  }, [nearbyUsers]);

  const onAvatarPress = useCallback(
    ({
      isAllAlreadyViewed,
      userId,
      flashesData,
    }:
      | {
          isAllAlreadyViewed: true;
          userId: string;
          flashesData: FlashesData;
        }
      | {
          isAllAlreadyViewed: false;
          userId: string;
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
              userData: {userId: userId, from: 'nearbyUsers'},
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

  return (
    <NearbyUsersList
      otherUsers={nearbyUsers}
      range={range}
      setRange={setRange}
      position={position}
      onListItemPress={navigateToUserPage}
      onAvatarPress={onAvatarPress}
    />
  );
};
