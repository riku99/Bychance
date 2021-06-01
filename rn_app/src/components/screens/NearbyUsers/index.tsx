import React, {useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SearchBar} from 'react-native-elements';

import {ListView} from './ListView';
import {MapView} from './MapView';

const Tab = createMaterialTopTabNavigator();

export const NearbyUsers = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const transformY = scrollY.interpolate({
    inputRange: [0, SEARCH_TAB_HEIGHT],
    outputRange: [0, -SEARCH_TAB_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <>
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
          // value={keyword}
          onChangeText={(text) => {
            // setKeyword(text);
          }}
        />
      </Animated.View>
      <Tab.Navigator
        style={{
          marginTop: SEARCH_TAB_HEIGHT,
        }}
        tabBarOptions={{
          style: {
            // backgroundColor: 'red',
          },
        }}>
        <Tab.Screen name="リスト" component={ListView} />
        <Tab.Screen name="マップ" component={MapView} />
      </Tab.Navigator>
    </>
  );
};

const SEARCH_TAB_HEIGHT = 50;

const styles = StyleSheet.create({
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
});
