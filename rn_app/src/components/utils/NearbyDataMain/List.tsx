import React, {useCallback, useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  Animated,
  FlatList,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ListItem} from 'react-native-elements';

import {Avatar} from './Avatar';
import {TabViewContext} from './index';
import {Name} from './Name';
import {TOP_HEIGHT} from './styles';
import {useSafeArea} from '~/hooks/appState';

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

  const renderItem = useCallback(
    ({item}: {item: typeof users[number]}) => {
      return (
        <ListItem
          containerStyle={{height: 72}}
          key={item.id}
          onPress={() => {
            if (navigateToUserPage) {
              navigateToUserPage(item.id);
            }
          }}>
          <Avatar user={item} />
          <ListItem.Content>
            <ListItem.Title>
              <Name id={item.id} name={item.name} />
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>
              {item.statusMessage}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    },
    [navigateToUserPage],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (refreshUsers) {
      await refreshUsers();
    }
    setRefreshing(false);
  }, [refreshUsers]);

  if (firstLoading) {
    return (
      <View style={{marginTop: TOP_HEIGHT + top + 10}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, {paddingTop: top + 10}]}>
      {users.length ? (
        <FlatList
          data={users}
          renderItem={renderItem}
          scrollEventThrottle={16}
          contentInset={{top: TOP_HEIGHT}}
          contentOffset={{
            y: -TOP_HEIGHT,
            x: 0,
          }}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: false,
            },
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
        />
      ) : (
        <View style={styles.noUser}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
              />
            }
            contentOffset={{
              y: -TOP_HEIGHT,
              x: 0,
            }}
            contentInset={{top: TOP_HEIGHT}}
            contentContainerStyle={[styles.noUserScroll, {marginTop: top}]}>
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
    marginTop: '50%',
  },
  noUserScroll: {
    alignItems: 'center',
    flex: 1,
  },
});
