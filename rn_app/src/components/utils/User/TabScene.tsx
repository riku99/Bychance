import React, {useCallback, useState} from 'react';
import {
  Animated,
  ScrollView,
  RefreshControl,
  ListRenderItem,
  FlatList,
} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';

import {selectPostsByUserId} from '~/stores/posts';
import {RootState} from '~/stores';

type PostData = {
  id: number;
  text: string | null;
  url: string;
  createdAt: string;
  userId: string;
  sourceType: 'image' | 'video';
};

type FlatListTabSceneProps = {
  renderItem?: ListRenderItem<PostData>;
  userId: string;
  scrollY: Animated.Value;
  tabViewRef: React.RefObject<FlatList>;
  onScrollEndDrag: () => void;
  onMomentumScrollEnd: () => void;
  paddingTopHeight: number;
  tabViewContainerMinHeight: number;
  refresh: () => Promise<void>;
};

export const FlatListTabScene = React.memo(
  ({
    userId,
    scrollY,
    tabViewRef,
    onScrollEndDrag,
    onMomentumScrollEnd,
    renderItem,
    paddingTopHeight,
    tabViewContainerMinHeight,
    refresh,
  }: FlatListTabSceneProps) => {
    const [refreshing, setRefreshing] = useState(false);

    const posts = useSelector(
      (state: RootState) => selectPostsByUserId(state, userId),
      shallowEqual,
    );

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await refresh();
      setRefreshing(false);
    }, [refresh]);

    return (
      <Animated.FlatList
        ref={tabViewRef}
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={3}
        horizontal={false}
        scrollEventThrottle={16}
        initialNumToRender={4}
        windowSize={2}
        contentContainerStyle={{
          paddingTop: paddingTopHeight,
          minHeight: tabViewContainerMinHeight,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
          },
        )}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  },
);

type ScrollViewTabSceneProps = {
  children: Element;
  userId: string;
  scrollY: Animated.Value;
  tabViewRef: React.RefObject<ScrollView>;
  onScrollEndDrag: () => void;
  onMomentumScrollEnd: () => void;
  paddingTopHeight: number;
  tabViewContainerMinHeight: number;
};

export const ScrollViewTabScene = React.memo(
  ({
    children,
    userId,
    scrollY,
    tabViewRef,
    onScrollEndDrag,
    onMomentumScrollEnd,
    paddingTopHeight,
    tabViewContainerMinHeight,
  }: ScrollViewTabSceneProps) => {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
      setRefreshing(true);

      setRefreshing(false);
    }, []);

    return (
      <Animated.ScrollView
        ref={tabViewRef}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: paddingTopHeight,
          minHeight: tabViewContainerMinHeight,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
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
