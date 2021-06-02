import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import {List} from './List';
import {RootState, AppDispatch} from '../../../stores/index';
import {AnotherUser} from '../../../stores/types';
import {selectNearbyUsersArray} from '../../../stores/nearbyUsers';
import {getNearbyUsersThunk} from '../../../apis/nearbyUsers/getNearbyUsers';
// import {SearchUsersStackNavigationProp} from '../../../screens/types';
import {FlashesData} from '~/stores/types';
import {FlashesStackParamList} from '../../../screens/Flashes';
import {RootNavigationProp} from '~/screens/Root';
import {getThumbnailUrl} from '~/helpers/video';
import {TabViewContext} from './index';

type Props = {
  view: 'list' | 'map';
};

// 使ってないけど参考したりしているため残している
export const TabView = React.memo(({view}: Props) => {
  const position = useSelector((state: RootState) => {
    const lat = state.userReducer.user!.lat;
    const lng = state.userReducer.user!.lng;
    return {lat, lng};
  }, shallowEqual);

  const [range, setRange] = useState(0.1);

  const nearbyUsers = useSelector((state: RootState) => {
    return selectNearbyUsersArray(state);
  }, shallowEqual);

  // オブジェクトの内容が変化した時のみpreloadを再実行したいので中身を検証するためにstringにする。
  const preloadUriGroup = useMemo(() => {
    return JSON.stringify(
      nearbyUsers
        .filter((user) => user.flashes.entities.length)
        .map((user) =>
          user.flashes.entities.map((e) => {
            const uri =
              e.sourceType === 'image' ? e.source : getThumbnailUrl(e.source);
            return {
              uri,
            };
          }),
        ),
    );
  }, [nearbyUsers]);

  // preload用uriの中身が変更した場合はそれをオブジェクトに戻しpreloadを実行。
  // preloadUriGroupをstringにせずにオブジェクトのまま依存関係に持たせていたら、preloadUriGroupの中身は変わっていなくてもnearbyUsersが変更する度にpreloadが走ってしまう。
  useEffect(() => {
    const preData = JSON.parse(preloadUriGroup) as {uri: string}[][];
    preData.forEach((data) => {
      FastImage.preload(data);
    });
  }, [preloadUriGroup]);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getNearbyUsersThunk({lat: position.lat, lng: position.lng, range}),
    );
  }, [dispatch, position.lat, position.lng, range]);

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

  const keyword = useContext(TabViewContext);
  useEffect(() => {
    console.log(keyword);
  }, [keyword]);

  return (
    <>
      {view === 'list' ? (
        <List
          users={nearbyUsers}
          range={range}
          setRange={setRange}
          position={position}
          onListItemPress={navigateToUserPage}
          onAvatarPress={onAvatarPress}
        />
      ) : (
        <></>
      )}
    </>
  );
});
