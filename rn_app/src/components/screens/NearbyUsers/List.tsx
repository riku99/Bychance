import React, {useCallback, useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ListItem} from 'react-native-elements';

import {Avatar} from './Avatar';
import {TabViewContext} from './index';
import {Name} from './Name';
import {SEARCH_TAB_HEIGHT, stickyTabHeight} from './styles';
import {useSafeArea} from '~/hooks/appState';

// アニメーションに関する部分は後々使うかもしれないのでコメントアウトで残す
export const List = React.memo(() => {
  const {
    users,
    refreshUsers,
    firstLoading,
    navigateToUserPage,
    scrollY,
  } = useContext(TabViewContext);
  const {top} = useSafeArea();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (refreshUsers) {
      await refreshUsers();
    }
    setRefreshing(false);
  }, [refreshUsers]);

  if (firstLoading) {
    return (
      <View style={{marginTop: SEARCH_TAB_HEIGHT + stickyTabHeight + top + 10}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, {marginTop: 10}]}>
      {users.length ? (
        <ScrollView
          scrollEventThrottle={16}
          contentContainerStyle={{marginTop: top, paddingBottom: top}}
          contentInset={{top: SEARCH_TAB_HEIGHT + stickyTabHeight}}
          contentOffset={{
            y: -SEARCH_TAB_HEIGHT - stickyTabHeight,
            x: 0,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: false,
            },
          )}>
          <View>
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
