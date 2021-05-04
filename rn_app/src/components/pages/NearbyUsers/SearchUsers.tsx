import React, {
  MutableRefObject,
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
import RNPickerSelect from 'react-native-picker-select';

import {UserAvatarWithOuter} from '../../utils/Avatar';
import {AnotherUser} from '../../../stores/types';
import {FlashesData} from '~/components/pages/Flashes/types';
import {normalStyles} from '~/constants/styles/normal';

type Props = {
  otherUsers: AnotherUser[];
  refRange: MutableRefObject<number>;
  setRange: Dispatch<SetStateAction<number>>;
  refreshing: boolean;
  onRefresh: (range: number) => void;
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
    refRange,
    setRange,
    refreshing,
    onRefresh,
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
                  onRefresh={() => onRefresh(refRange.current)}
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
                    {u.flashes.entities.length &&
                    !u.flashes.isAllAlreadyViewed ? ( // 閲覧していないアイテムが残っている場合
                      <UserAvatarWithOuter
                        image={u.avatar}
                        size="medium"
                        opacity={1}
                        outerType="gradation"
                        onPress={() => {
                          onAvatarPress({
                            userId: u.id,
                            isAllAlreadyViewed: false,
                            flashesData: undefined,
                          });
                        }}
                      />
                    ) : u.flashes.entities.length && u.flashes.alreadyViewed ? ( // アイテムは持っているが、全て閲覧されている場合
                      <UserAvatarWithOuter
                        image={u.avatar}
                        size="medium"
                        opacity={1}
                        outerType="silver"
                        onPress={() => {
                          onAvatarPress({
                            userId: u.id,
                            isAllAlreadyViewed: true,
                            flashesData: u.flashes,
                          });
                        }}
                      />
                    ) : (
                      <UserAvatarWithOuter
                        image={u.statusMessage}
                        size="medium"
                        opacity={1}
                        outerType="none"
                      />
                    )}
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

        <RNPickerSelect
          onValueChange={(value) => {
            refRange.current = value;
            setRange(refRange.current);
          }}
          items={[
            {label: '100m', value: 0.1},
            {label: '200m', value: 0.2},
            {label: '300m', value: 0.3},
            {label: '400m', value: 0.4},
            {label: '500m', value: 0.5},
            {label: '1km', value: 1},
          ]}
          placeholder={{}}
          style={{
            viewContainer: {
              backgroundColor: normalStyles.mainColor,
              width: 130,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40,
              position: 'absolute',
              bottom: '3%',
              right: '7%',
            },
            inputIOS: {
              color: 'white',
              fontSize: 15,
              fontWeight: 'bold',
            },
          }}
          doneText="完了"
        />
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
  selectButtonContainer: {
    backgroundColor: 'gray',
    width: 170,
    justifyContent: 'center',
  },
});
