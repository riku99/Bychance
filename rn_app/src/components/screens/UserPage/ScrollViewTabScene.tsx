import React, {useCallback, useState, useMemo} from 'react';
import {Animated, ScrollView, RefreshControl, View} from 'react-native';
import {useDispatch} from 'react-redux';

import {AppDispatch} from '../../../stores/index';
import {refreshUserThunk} from '../../../apis/users/refreshUser';
import {stickyTabHeight} from './TabView';

type TabSceneProps = {
  children: Element;
  userId: string;
  scrollY: Animated.Value;
  tabViewRef: React.RefObject<ScrollView>;
  onScrollEndDrag: () => void;
  onMomentumScrollEnd: () => void;
  setMostRecentlyScrolledView: () => void;
  profileContainerHeight: number;
};

export const ScrollViewTabScene = React.memo(
  ({
    children,
    userId,
    scrollY,
    tabViewRef,
    onScrollEndDrag,
    onMomentumScrollEnd,
    setMostRecentlyScrolledView,
    profileContainerHeight,
  }: TabSceneProps) => {
    const dispatch: AppDispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await dispatch(
        refreshUserThunk({
          userId,
        }),
      );
      setRefreshing(false);
    }, [dispatch, userId]);

    const paddingTopHeight = useMemo(
      () => profileContainerHeight + stickyTabHeight,
      [profileContainerHeight],
    );

    return (
      <Animated.ScrollView
        ref={tabViewRef}
        scrollEventThrottle={16}
        style={{
          paddingTop: paddingTopHeight,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
          },
        )}
        onScrollBeginDrag={setMostRecentlyScrolledView}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {children}
      </Animated.ScrollView>
    );
  },
);
