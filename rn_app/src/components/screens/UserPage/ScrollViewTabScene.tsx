import React, {useCallback, useState} from 'react';
import {Animated, ScrollView, RefreshControl} from 'react-native';
import {useDispatch} from 'react-redux';

import {AppDispatch} from '../../../stores/index';
import {refreshUserThunk} from '../../../apis/users/refreshUser';
import {stickyTabHeight} from './TabView';

type TabSceneProps = {
  children: Element;
  userId: string;
  contentsPaddingTop: number;
  scrollY: Animated.Value;
  tabViewRef: React.RefObject<ScrollView>;
  onScrollEndDrag: () => void;
  onMomentumScrollEnd: () => void;
  setMostRecentlyScrolledView: () => void;
};

export const ScrollViewTabScene = React.memo(
  ({
    children,
    userId,
    contentsPaddingTop,
    scrollY,
    tabViewRef,
    onScrollEndDrag,
    onMomentumScrollEnd,
    setMostRecentlyScrolledView,
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

    return (
      <Animated.ScrollView
        ref={tabViewRef}
        scrollEventThrottle={1}
        style={{paddingTop: contentsPaddingTop + stickyTabHeight}}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
            listener: () => {
              setMostRecentlyScrolledView();
            },
          },
        )}
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
