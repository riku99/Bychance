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
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
} from '@react-navigation/material-top-tabs';
import {SearchBar} from 'react-native-elements';
import {shallowEqual, useSelector} from 'react-redux';
import BackgroundGeolocation from 'react-native-background-geolocation';
import FastImage from 'react-native-fast-image';

import {List} from './List';
import {Map} from './Map';
import {RangeSelectButton} from './RangeSelectBottun';
import {RootState} from '~/stores';
import {getThumbnailUrl} from '~/helpers/video';
import {RootNavigationProp} from '~/navigations/Root';
import {NearbyUsersStackNavigationProp} from '~/navigations/NearbyUsers';
import {normalStyles} from '~/constants/styles';
import {
  notAuthLocationProviderAlert,
  notLocationInfoAlert,
} from '~/helpers/alert';
import {useNearbyUsers} from '~/hooks/nearbyUsers';
import {selectNotAllViewedUserIds} from '~/stores/flashes';
import {usePrefetchStamps} from '~/hooks/flashStamps';
import {SEARCH_TAB_HEIGHT, stickyTabHeight} from './styles';
import {useSafeArea} from '~/hooks/appState';

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
  navigateToUserPage?: (userId: string) => void;
  onAvatarPress?: ({
    userId,
    type,
  }: {
    userId: string;
    type: 'one' | 'sequence';
  }) => void;
  refreshUsers?: () => Promise<void>;
  firstLoading: boolean;
  scrollY: Animated.Value;
};

// createMaterialTopTabNavigatorでスクリーンを作る際に、componentにインラインで記述するとパフォーマンスの問題があるのでインラインの記述はしたくない
// そうするとpropsを渡すのが難しくなる。それぞれのスクリーンが独立していたら問題ないが、今回は同じデータを参照したい。これは本来親コンポーネントからpropsで渡していたが、今回それができないのでContextで対応する
export const TabViewContext = createContext<TabViewContextType>({
  users: [],
  keyword: '',
  firstLoading: false,
  scrollY: new Animated.Value(0),
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

  const {top} = useSafeArea();
  console.log(top);

  const scrollY = useRef(
    new Animated.Value(-SEARCH_TAB_HEIGHT - stickyTabHeight),
  ).current;
  const opacity = scrollY.interpolate({
    inputRange: [-SEARCH_TAB_HEIGHT - stickyTabHeight, -stickyTabHeight],
    outputRange: [1, 0],
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
    const preData = JSON.parse(preloadUriGroup) as string[][];
    preData.forEach((_data) => {
      const formated = _data.map((d) => ({uri: d}));
      FastImage.preload(formated);
    });
  }, [preloadUriGroup]);

  const {prefetch} = usePrefetchStamps();
  useEffect(() => {
    const firstFlashIds = users.map((u) => u.flashIds[0]); // ここではそれぞれのユーザーの最初のものだけprefetchする(stratingIndexがどこからか不確定なため)。2つめ以降は表示するスクリーンで行う
    firstFlashIds.forEach((id) => {
      prefetch(id);
    });
  }, [prefetch, users]);

  const searchStackNavigation = useNavigation<
    NearbyUsersStackNavigationProp<'NearbyUsers'>
  >();
  const rootStackNavigation = useNavigation<RootNavigationProp<'Tab'>>();

  const navigateToUserPage = useCallback(
    (userId: string) => {
      searchStackNavigation.navigate('UserPage', {
        userId,
      });
    },
    [searchStackNavigation],
  );

  const sequenceData = useSelector((state: RootState) => {
    const ids = filteredUsers.map((u) => u.id);
    return selectNotAllViewedUserIds(state, ids);
  }, shallowEqual);

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
    },
    [rootStackNavigation, sequenceData],
  );

  const refreshUsers = useCallback(async () => {
    await getNearbyUsers();
  }, [getNearbyUsers]);

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
      scrollY,
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
      scrollY,
    ],
  );

  const renderTabBar = useCallback(
    (props: any) => {
      const y = scrollY.interpolate({
        inputRange: [-SEARCH_TAB_HEIGHT - stickyTabHeight, -stickyTabHeight],
        outputRange: [top, -SEARCH_TAB_HEIGHT + top],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          style={[
            styles.tabAndSearchBarContainer,
            {
              transform: [{translateY: y}],
            },
          ]}>
          <Animated.View style={{opacity}}>
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
          <MaterialTopTabBar {...props} />
        </Animated.View>
      );
    },
    [scrollY, keyword, top, opacity],
  );

  return (
    <View style={[styles.container]}>
      <TabViewContext.Provider value={tabViewContextData}>
        <Animated.View style={{height: '100%'}}>
          <Tab.Navigator
            tabBar={renderTabBar}
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
        </Animated.View>
      </TabViewContext.Provider>
      <View style={styles.pickButtonContainer}>
        <RangeSelectButton setRange={setRange} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  displayOptionsContainer: {
    backgroundColor: 'white',
    height: SEARCH_TAB_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
  tabAndSearchBarContainer: {
    top: 0,
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    backgroundColor: 'white',
  },
});
