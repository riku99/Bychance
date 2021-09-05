import React, {useCallback, useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  SafeAreaView,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ListItem, SearchBar} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Avatar} from './Avatar';
import {TabViewContext} from './index';
import {Name} from './Name';
import {SEARCH_TAB_HEIGHT, stickyTabHeight} from './styles';

// アニメーションに関する部分は後々使うかもしれないのでコメントアウトで残す
export const List = React.memo(() => {
  const {
    users,
    refreshUsers,
    firstLoading,
    navigateToUserPage,
    scrollY,
  } = useContext(TabViewContext);
  const {top} = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (refreshUsers) {
      await refreshUsers();
    }
    setRefreshing(false);
  }, [refreshUsers]);

  // const caluculateDuration = useCallback((n: number) => {
  //   return n * 5;
  // }, []);

  if (firstLoading) {
    return (
      <View style={{marginTop: 10}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      {users.length ? (
        <SafeAreaView>
          <ScrollView
            scrollEventThrottle={16}
            contentInset={{top: SEARCH_TAB_HEIGHT + stickyTabHeight}}
            contentOffset={{
              y: -SEARCH_TAB_HEIGHT - stickyTabHeight,
              x: 0,
            }}
            contentContainerStyle={
              {
                // paddingTop: SEARCH_TAB_HEIGHT + stickyTabHeight,
              }
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
                progressViewOffset={120}
              />
            }
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {
                useNativeDriver: false,
                // listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                //   if (e.nativeEvent.contentOffset.y > SEARCH_TAB_HEIGHT) {
                //     scrollY.setValue(SEARCH_TAB_HEIGHT);
                //   }
                // },
              },
            )}
            // onScrollEndDrag={(e) => {
            //   if (e.nativeEvent.contentOffset.y > offsetY.current) {
            //     offsetY.current = e.nativeEvent.contentOffset.y;
            //   } else if (e.nativeEvent.contentOffset.y < offsetY.current) {
            //     Animated.timing(scrollY, {
            //       toValue: 0,
            //       duration: caluculateDuration(
            //         offsetY.current > 80 ? 80 : offsetY.current,
            //       ),
            //       useNativeDriver: false,
            //     }).start();
            //     offsetY.current = e.nativeEvent.contentOffset.y;
            //   }
            // }}
          >
            <View style={{marginTop: 5}}>
              {users.map((u) => (
                <ListItem
                  containerStyle={{height: 72}}
                  key={u.id}
                  onPress={() => {
                    if (navigateToUserPage) {
                      navigateToUserPage(u.id);
                    }
                  }}>
                  <Avatar user={u} />
                  <ListItem.Content>
                    <ListItem.Title>
                      <Name id={u.id} name={u.name} />
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.subtitle}>
                      {u.statusMessage}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
              {users.map((u) => (
                <ListItem
                  containerStyle={{height: 72}}
                  key={u.id}
                  onPress={() => {
                    if (navigateToUserPage) {
                      navigateToUserPage(u.id);
                    }
                  }}>
                  <Avatar user={u} />
                  <ListItem.Content>
                    <ListItem.Title>
                      <Name id={u.id} name={u.name} />
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.subtitle}>
                      {u.statusMessage}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
              {users.map((u) => (
                <ListItem
                  containerStyle={{height: 72}}
                  key={u.id}
                  onPress={() => {
                    if (navigateToUserPage) {
                      navigateToUserPage(u.id);
                    }
                  }}>
                  <Avatar user={u} />
                  <ListItem.Content>
                    <ListItem.Title>
                      <Name id={u.id} name={u.name} />
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.subtitle}>
                      {u.statusMessage}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
              {users.map((u) => (
                <ListItem
                  containerStyle={{height: 72}}
                  key={u.id}
                  onPress={() => {
                    if (navigateToUserPage) {
                      navigateToUserPage(u.id);
                    }
                  }}>
                  <Avatar user={u} />
                  <ListItem.Content>
                    <ListItem.Title>
                      <Name id={u.id} name={u.name} />
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.subtitle}>
                      {u.statusMessage}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
              {users.map((u) => (
                <ListItem
                  containerStyle={{height: 72}}
                  key={u.id}
                  onPress={() => {
                    if (navigateToUserPage) {
                      navigateToUserPage(u.id);
                    }
                  }}>
                  <Avatar user={u} />
                  <ListItem.Content>
                    <ListItem.Title>
                      <Name id={u.id} name={u.name} />
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.subtitle}>
                      {u.statusMessage}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <View style={styles.noUser}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
              />
            }
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text style={styles.noUserText}>この範囲にユーザーはいません</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 3,
  },
  noUser: {
    flex: 1,
  },
  noUserText: {
    fontSize: 18,
    color: '#999999',
  },
});
