import React, {
  useRef,
  useState,
  createContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {StyleSheet, Animated, View} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SearchBar} from 'react-native-elements';
import {shallowEqual, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackgroundGeolocation from 'react-native-background-geolocation';

import {List} from './List';
import {Map} from './Map';
import {RangeSelectButton} from './RangeSelectBottun';
import {RootState} from '~/stores';
import {NearbyUser, selectNearbyUsersArray} from '~/stores/nearbyUsers';
import {NearbyUsers} from '~/stores/nearbyUsers';
import {getThumbnailUrl} from '~/helpers/video';
import {RootNavigationProp} from '~/navigations/Root';
import {FlashesData} from '~/stores/types';
import {NearbyUsersStackNavigationProp} from '~/navigations/NearbyUsers';
import {FlashesStackParamList} from '~/navigations/Flashes';
import {normalStyles} from '~/constants/styles';
import {
  notAuthLocationProviderAlert,
  notLocationInfoAlert,
} from '~/helpers/alert';
import {useGetNearbyUsers} from '~/hooks/nearbyUsers';

const Tab = createMaterialTopTabNavigator();

type TabViewContextType = {
  keyword: string;
  users: NearbyUsers;
  lng?: number | null;
  lat?: number | null;
  navigateToUserPage?: (user: NearbyUser) => void;
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
  refreshUsers?: () => Promise<void>;
  firstLoading: boolean;
};

// createMaterialTopTabNavigatorでスクリーンを作る際に、componentにインラインで記述するとパフォーマンスの問題があるのでインラインの記述はしたくない
// そうするとpropsを渡すのが難しくなる。それぞれのスクリーンが独立していたら問題ないが、今回は同じデータを参照したい。これは本来親コンポーネントからpropsで渡していたが、今回それができないのでContextで対応する
export const TabViewContext = createContext<TabViewContextType>({
  users: [],
  keyword: '',
  firstLoading: false,
});

export const NearbyUsersScreen = React.memo(() => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const transformY = scrollY.interpolate({
    inputRange: [0, SEARCH_TAB_HEIGHT],
    outputRange: [0, -SEARCH_TAB_HEIGHT],
    extrapolate: 'clamp',
  });

  const lat = useSelector((state: RootState) => {
    const _lat = state.userReducer.user!.lat;
    return _lat;
  }, shallowEqual);

  const lng = useSelector((state: RootState) => {
    const _lng = state.userReducer.user!.lng;
    return _lng;
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

  const {getNearbyUsers} = useGetNearbyUsers();

  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    const _get = async () => {
      setFirstLoading(true);
      await getNearbyUsers({lat, lng, range});
      setFirstLoading(false);
    };
    _get();
  }, [getNearbyUsers, lat, lng, range]);

  useFocusEffect(
    useCallback(() => {
      const checkLocation = async () => {
        const authState = await BackgroundGeolocation.getProviderState();
        if (lat && lng) {
          if (authState.enabled) {
            return;
          } else {
            notAuthLocationProviderAlert();
            return;
          }
        } else {
          if (authState.enabled) {
            notLocationInfoAlert();
          } else {
            notAuthLocationProviderAlert();
          }
        }
      };
      checkLocation();
    }, [lat, lng]),
  );

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

  const navigateToUserPage = useCallback(
    (user: NearbyUser) => {
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
        rootStackNavigation.navigate('Flashes', {
          screen: 'Flashes',
          params: navigationParams!,
        });
      }
    },
    [rootStackNavigation, sequenceFlashesAndUserData],
  );

  const refreshUsers = useCallback(async () => {
    await getNearbyUsers({lat, lng, range});
  }, [lat, lng, range, getNearbyUsers]);

  const {top} = useSafeAreaInsets();

  const tabViewContextData = useMemo(
    () => ({
      users: filteredUsers,
      keyword,
      onAvatarPress,
      navigateToUserPage,
      lat,
      lng,
      refreshUsers,
      firstLoading,
    }),
    [
      filteredUsers,
      keyword,
      onAvatarPress,
      navigateToUserPage,
      lat,
      lng,
      refreshUsers,
      firstLoading,
    ],
  );

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <Animated.View
        style={{
          ...styles.displayOptionsContainer,
          transform: [{translateY: transformY}],
        }}>
        <SearchBar
          placeholder="キーワードを検索"
          inputContainerStyle={styles.searchInputContainer}
          containerStyle={styles.searchContainer}
          platform="default"
          value={keyword}
          onChangeText={(text) => {
            setKeyword(text);
          }}
        />
      </Animated.View>
      <TabViewContext.Provider value={tabViewContextData}>
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
          }}>
          <Tab.Screen name="リスト" component={List} />
          <Tab.Screen name="マップ" component={Map} />
        </Tab.Navigator>
      </TabViewContext.Provider>
      <View style={styles.pickButtonContainer}>
        <RangeSelectButton setRange={setRange} />
      </View>
    </View>
  );
});

const SEARCH_TAB_HEIGHT = 45;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  pickButtonContainer: {
    position: 'absolute',
    bottom: '3%',
    right: '7%',
    width: 130,
    height: 40,
  },
});
