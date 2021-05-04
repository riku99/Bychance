import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Text,
  RefreshControl,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ListItem} from 'react-native-elements';
import {SearchBar} from 'react-native-elements';
import {useDispatch} from 'react-redux';

import {AnotherUser} from '../../../stores/types';
import {FlashesData} from '~/components/pages/Flashes/types';
import {Avatar} from './Avatar';
import {RangeSelector} from './RangeSelector';
import {AppDispatch} from '../../../stores/index';
import {getNearbyUsersThunk} from '../../../actions/nearbyUsers/getNearbyUsers';

type Props = {
  otherUsers: AnotherUser[];
  range: number;
  setRange: Dispatch<SetStateAction<number>>;
  position: {lat: number | null; lng: number | null};
  onListItemPress: (user: AnotherUser) => void;
  onAvatarPress: ({
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

export const SearchUsers = React.memo(
  ({
    otherUsers,
    range,
    setRange,
    position,
    onListItemPress,
    onAvatarPress,
  }: Props) => {
    const [filteredUsers, setFilteredUsers] = useState(otherUsers);
    const [keyword, setKeyword] = useState('');

    const scrollY = useRef(new Animated.Value(0)).current;
    const offsetY = useRef(0);

    const caluculateDuration = useCallback((n: number) => {
      return n * 5;
    }, []);

    const transformY = scrollY.interpolate({
      inputRange: [0, SEARCH_TAB_HEIGHT],
      outputRange: [0, -SEARCH_TAB_HEIGHT],
      extrapolate: 'clamp',
    });

    useEffect(() => {
      if (keyword === '') {
        setFilteredUsers(otherUsers);
      } else {
        const matchedUsers = otherUsers.filter((u) => {
          return (
            u.name.toLowerCase().includes(keyword.toLowerCase()) ||
            u.introduce.toLowerCase().includes(keyword.toLowerCase()) ||
            u.statusMessage.toLowerCase().includes(keyword.toLowerCase())
          );
        });
        setFilteredUsers(matchedUsers);
      }
    }, [keyword, otherUsers]);

    const dispatch: AppDispatch = useDispatch();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(
      async (range: number) => {
        setRefreshing(true);
        await dispatch(
          getNearbyUsersThunk({lat: position.lat, lng: position.lng, range}),
        );
        setRefreshing(false);
      },
      [dispatch, position.lat, position.lng],
    );

    return (
      <View style={styles.container}>
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
        {filteredUsers.length ? (
          <>
            <ScrollView
              contentInset={{top: SEARCH_TAB_HEIGHT}}
              contentOffset={{y: -SEARCH_TAB_HEIGHT, x: 0}}
              scrollEventThrottle={16}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => onRefresh(range)}
                />
              }
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: scrollY}}}],
                {
                  useNativeDriver: false,
                  listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                    if (e.nativeEvent.contentOffset.y > SEARCH_TAB_HEIGHT) {
                      scrollY.setValue(SEARCH_TAB_HEIGHT);
                    }
                  },
                },
              )}
              onScrollEndDrag={(e) => {
                if (e.nativeEvent.contentOffset.y > offsetY.current) {
                  offsetY.current = e.nativeEvent.contentOffset.y;
                } else if (e.nativeEvent.contentOffset.y < offsetY.current) {
                  Animated.timing(scrollY, {
                    toValue: 0,
                    duration: caluculateDuration(
                      offsetY.current > 80 ? 80 : offsetY.current,
                    ),
                    useNativeDriver: false,
                  }).start();
                  offsetY.current = e.nativeEvent.contentOffset.y;
                }
              }}>
              <View>
                {filteredUsers.map((u) => (
                  <ListItem
                    containerStyle={{height: 75}}
                    key={u.id}
                    onPress={() => {
                      onListItemPress(u);
                    }}>
                    <Avatar user={u} onAvatarPress={onAvatarPress} />
                    <ListItem.Content>
                      <ListItem.Title>{u.name}</ListItem.Title>
                      <ListItem.Subtitle style={styles.subtitle}>
                        {u.statusMessage}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                ))}
              </View>
            </ScrollView>
          </>
        ) : (
          <View style={styles.noUser}>
            <Text style={styles.noUserText}>この範囲にユーザーはいません</Text>
          </View>
        )}

        <View style={styles.pcikerContainer}>
          <RangeSelector setRange={setRange} />
        </View>
      </View>
    );
  },
);

const SEARCH_TAB_HEIGHT = 50;

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
  },
  searchInputContainer: {
    width: '90%',
    height: 30,
    backgroundColor: '#ebebeb',
    alignSelf: 'center',
  },
  iosPicker: {
    color: '#2c3e50',
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 3,
  },
  noUser: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noUserText: {
    fontSize: 18,
    color: '#999999',
  },
  pcikerContainer: {
    position: 'absolute',
    bottom: '3%',
    right: '7%',
    width: 130,
    height: 40,
  },
});
