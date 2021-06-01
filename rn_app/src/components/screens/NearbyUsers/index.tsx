import React, {
  useRef,
  useState,
  createContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {StyleSheet, Animated, SafeAreaView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SearchBar} from 'react-native-elements';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';

import {MapView} from './MapView';
import {List} from './nearbyUsersList';
import {RootState} from '~/stores';
import {selectNearbyUsersArray} from '~/stores/nearbyUsers';
import {getNearbyUsersThunk} from '~/apis/nearbyUsers/getNearbyUsers';
import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {NearbyUsers} from '~/stores/nearbyUsers';
import {getThumbnailUrl} from '~/helpers/video';
import {RootNavigationProp} from '~/screens/Root';
import {AnotherUser, FlashesData} from '~/stores/types';
import {NearbyUsersStackNavigationProp} from '~/screens/NearbyUsers';
import {FlashesStackParamList} from '~/screens/Flashes';
import {normalStyles} from '~/constants/styles/normal';

const Tab = createMaterialTopTabNavigator();

type TabViewContextType = {
  keyword: string;
  users: NearbyUsers;
  onListItemPress?: (user: AnotherUser) => void;
  onAvatarPress?: ({
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
      }) => void;
};

export const TabViewContext = createContext<TabViewContextType>({
  users: [],
  keyword: '',
});

export const NearbyUsersScreen = React.memo(() => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const transformY = scrollY.interpolate({
    inputRange: [0, SEARCH_TAB_HEIGHT],
    outputRange: [0, -SEARCH_TAB_HEIGHT],
    extrapolate: 'clamp',
  });

  const position = useSelector((state: RootState) => {
    const lat = state.userReducer.user!.lat;
    const lng = state.userReducer.user!.lng;
    return {lat, lng};
  }, shallowEqual);

  const [range, setRange] = useState(0.1);

  const users = useSelector((state: RootState) => {
    return selectNearbyUsersArray(state);
  }, shallowEqual);

  const [keyword, setKeyword] = useState('');

  const filteredUsers = useMemo(() => {
    if (keyword === '') {
      return users;
    } else {
      const matchedUsers = users.filter((u) => {
        return (
          u.name.toLowerCase().includes(keyword.toLowerCase()) ||
          (u.introduce &&
            u.introduce.toLowerCase().includes(keyword.toLowerCase())) ||
          (u.statusMessage &&
            u.statusMessage.toLowerCase().includes(keyword.toLowerCase()))
        );
      });
      return matchedUsers;
    }
  }, [keyword, users]);

  const dispatch = useCustomDispatch();

  useEffect(() => {
    dispatch(
      getNearbyUsersThunk({lat: position.lat, lng: position.lng, range}),
    );
  }, [dispatch, position.lat, position.lng, range]);

  // オブジェクトの内容が変化した時のみpreloadを再実行したいので中身を検証するためにstringにする。
  const preloadUriGroup = useMemo(() => {
    return JSON.stringify(
      users
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
  }, [users]);

  // preload用uriの中身が変更した場合はそれをオブジェクトに戻しpreloadを実行。
  // preloadUriGroupをstringにせずにオブジェクトのまま依存関係に持たせていたら、preloadUriGroupの中身は変わっていなくてもnearbyUsersが変更する度にpreloadが走ってしまう。
  useEffect(() => {
    const preData = JSON.parse(preloadUriGroup) as {uri: string}[][];
    preData.forEach((data) => {
      FastImage.preload(data);
    });
  }, [preloadUriGroup]);

  const searchStackNavigation = useNavigation<
    NearbyUsersStackNavigationProp<'NearbyUsers'>
  >();

  const rootStackNavigation = useNavigation<RootNavigationProp<'Tab'>>();

  const onListItemPress = useCallback(
    (user: AnotherUser) => {
      searchStackNavigation.navigate('UserPage', {
        userId: user.id,
        from: 'nearbyUsers',
      });
    },
    [searchStackNavigation],
  );

  // フラッシュを連続で表示(一人のを全て見たら次のユーザーのものにうつる)するためのデータ
  const sequenceFlashesAndUserData = useMemo(() => {
    if (users.length) {
      const haveFlashEntitiesAndNotAllAlreadyViewedUser = users.filter(
        (data) =>
          data.flashes.entities.length && !data.flashes.isAllAlreadyViewed,
      );
      const data = haveFlashEntitiesAndNotAllAlreadyViewedUser.map((user) => ({
        flashesData: user.flashes,
        userData: {userId: user.id, from: 'nearbyUsers'} as const,
      }));
      return data;
    }
  }, [users]);

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
    <View style={{flex: 1}}>
      <SafeAreaView />
      <Animated.View
        style={{
          ...styles.displayOptionsContainer,
          transform: [{translateY: transformY}],
        }}>
        <SearchBar
          placeholder="キーワードを検索"
          inputContainerStyle={styles.searchInputContainer}
          containerStyle={styles.searchContainer}
          lightTheme={true}
          round={true}
          value={keyword}
          onChangeText={(text) => {
            setKeyword(text);
          }}
        />
      </Animated.View>
      <TabViewContext.Provider
        value={{
          users: filteredUsers,
          keyword,
          onAvatarPress,
          onListItemPress,
        }}>
        <Tab.Navigator
          tabBarPosition="top"
          tabBarOptions={{
            activeTintColor: normalStyles.mainColor,
            labelStyle: {
              fontSize: 14,
              fontWeight: '500',
            },
            indicatorStyle: {
              backgroundColor: normalStyles.mainColor,
            },
            tabStyle: {
              height: 45,
              alignItems: 'center',
            },
            style: {},
          }}>
          <Tab.Screen name="リスト" component={List} />
          <Tab.Screen name="マップ" component={MapView} />
        </Tab.Navigator>
      </TabViewContext.Provider>
    </View>
  );
});

const SEARCH_TAB_HEIGHT = 45;

const styles = StyleSheet.create({
  displayOptionsContainer: {
    //backgroundColor: 'white',
    //height: SEARCH_TAB_HEIGHT,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // zIndex: 10,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    height: SEARCH_TAB_HEIGHT,
  },
  searchInputContainer: {
    width: '90%',
    height: 30,
    backgroundColor: '#f2f2f2',
    alignSelf: 'center',
  },
});
