import React, {
  useRef,
  useState,
  createContext,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {StyleSheet, Animated, View} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SearchBar} from 'react-native-elements';
import {shallowEqual, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackgroundGeolocation from 'react-native-background-geolocation';
import FastImage from 'react-native-fast-image';

import {List} from './List';
import {Map} from './Map';
import {RangeSelectButton} from './RangeSelectBottun';
import {RootState} from '~/stores';
import {NearbyUser} from '~/stores/nearbyUsers';
import {getThumbnailUrl} from '~/helpers/video';
import {RootNavigationProp} from '~/navigations/Root';
import {NearbyUsersStackNavigationProp} from '~/navigations/NearbyUsers';
import {FlashesScreenPrarams} from '~/navigations/Flashes';
import {normalStyles} from '~/constants/styles';
import {
  notAuthLocationProviderAlert,
  notLocationInfoAlert,
} from '~/helpers/alert';
import {useNearbyUsers} from '~/hooks/nearbyUsers';
import {
  selectFlashesByUserIds,
  selectNotAllViewedUserIds,
} from '~/stores/flashes';

const Tab = createMaterialTopTabNavigator();

export type UserData = {
  id: string;
  name: string;
  avatar: string | null;
  statusMessage: string | null;
  lat: number;
  lng: number;
  flashIds: number[];
};

type TabViewContextType = {
  keyword: string;
  users: UserData[];
  lng?: number | null;
  lat?: number | null;
  navigateToUserPage?: (user: NearbyUser) => void;
  onAvatarPress?: ({
    userId,
    type,
  }: {
    userId: string;
    type: 'one' | 'sequence';
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
  const {data, isLoading, setRange, getNearbyUsers} = useNearbyUsers();
  const users = useMemo(() => {
    return data.map((d) => {
      const {flashes, ...restData} = d;
      const flashIds = flashes.map((f) => f.id);
      return {
        ...restData,
        flashIds,
      };
    });
  }, [data]);

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
      data
        .filter((d) => d.flashes.length)
        .map((fs) =>
          fs.flashes.map((f) =>
            f.sourceType === 'image' ? f.source : getThumbnailUrl(f.source),
          ),
        ),
    );
  }, [data]);

  // preload用uriの中身が変更した場合はそれをオブジェクトに戻しpreloadを実行。
  // preloadUriGroupをstringにせずにオブジェクトのまま依存関係に持たせていたら、preloadUriGroupの中身は変わっていなくてもnearbyUsersが変更する度にpreloadが走ってしまう。
  useEffect(() => {
    console.log('preload');
    const preData = JSON.parse(preloadUriGroup) as string[][];
    console.log(preData);
    preData.forEach((_data) => {
      const formated = _data.map((d) => ({uri: d}));
      FastImage.preload(formated);
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
      });
    },
    [searchStackNavigation],
  );

  const sequenceData = useSelector((state: RootState) => {
    const ids = filteredUsers.map((u) => u.id);
    return selectNotAllViewedUserIds(state, ids);
  }, shallowEqual);
  console.log(sequenceData);

  // フラッシュを連続で表示(一人のを全て見たら次のユーザーのものにうつる)するためのデータ
  // userIdsを返す

  const onAvatarPress = useCallback(
    ({userId, type}: {userId: string; type: 'one' | 'sequence'}) => {
      if (type === 'one') {
        rootStackNavigation.navigate('Flashes', {
          screen: 'Flashes',
          params: {
            startingIndex: 0,
            userIds: [userId],
          },
        });
        return;
      }

      if (type === 'sequence') {
        const startingIndex = sequenceData!.findIndex((s) => s === userId);
        rootStackNavigation.navigate('Flashes', {
          screen: 'Flashes',
          params: {
            startingIndex: startingIndex,
            userIds: sequenceData,
          },
        });
      }
      // let navigationParams: FlashesScreenPrarams;
      // // viewedAllFlashesがtrueであれば連続して表示せずにそのユーザーのもののみ表示させる。なのでこの場合はそのユーザーのデータを引数でうける
      // if (viewedAllFlashes && flashes) {
      //   navigationParams = {
      //     isMyData: false,
      //     startingIndex: 0,
      //     data: [
      //       {
      //         flashes,
      //         user,
      //       },
      //     ],
      //   };
      //   // isAllAlreadyViewedがfalseの場合他のユーザーのものも連続で表示させる必要があるのでsequenceDataを渡す
      // } else if (!viewedAllFlashes && sequenceData) {
      //   const startingIndex = sequenceData!.findIndex(
      //     (item) => item.user.id === user.id,
      //   );
      //   navigationParams = {
      //     isMyData: false,
      //     startingIndex,
      //     data: sequenceData,
      //   };
      // }
      // if (navigationParams!) {
      //   rootStackNavigation.navigate('Flashes', {
      //     screen: 'Flashes',
      //     params: navigationParams!,
      //   });
      // }
    },
    [rootStackNavigation, sequenceData],
  );

  const refreshUsers = useCallback(async () => {
    await getNearbyUsers();
  }, [getNearbyUsers]);

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
      firstLoading: isLoading,
    }),
    [
      filteredUsers,
      keyword,
      onAvatarPress,
      navigateToUserPage,
      lat,
      lng,
      refreshUsers,
      isLoading,
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
