import React, {useCallback, useState} from 'react';
import {
  Animated,
  ScrollView,
  RefreshControl,
  ListRenderItem,
  FlatList,
  View,
} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';

import {selectPostsByUserId} from '~/stores/posts';
import {RootState} from '~/stores';
import {TabPostsLoading} from './TabPostsLoading';

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
  isLoaidng?: boolean;
  isDisplayed: boolean;
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
    isLoaidng,
    isDisplayed,
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

    if (!posts.length && isLoaidng) {
      return (
        <View style={{paddingTop: paddingTopHeight}}>
          <TabPostsLoading />
        </View>
      );
    }

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
        onScroll={
          isDisplayed
            ? Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
                useNativeDriver: true,
              })
            : undefined
        }
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
  isDisplayed: boolean;
};

export const ScrollViewTabScene = React.memo(
  ({
    children,
    scrollY,
    tabViewRef,
    onScrollEndDrag,
    onMomentumScrollEnd,
    paddingTopHeight,
    tabViewContainerMinHeight,
    isDisplayed,
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
        onScroll={
          // このビューじゃない方がレンダリングされている時に、スクロール中にボトムタブで切り替えるとこのonScrollが発火しておかしな位置になってしまうのでこのビューがレンダリングされている時のみAnimated.eventを実行する
          isDisplayed
            ? Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
                useNativeDriver: true,
              })
            : undefined
        }
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
