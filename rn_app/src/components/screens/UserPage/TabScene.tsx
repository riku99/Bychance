import React, {useCallback, useState} from 'react';
import {
  Animated,
  ScrollView,
  RefreshControl,
  ListRenderItem,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {Post} from '~/stores/posts';
import {useRefreshUser} from '~/hooks/users';

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
  renderData?: PostData[];
  userId: string;
  scrollY: Animated.Value;
  tabViewRef: React.RefObject<FlatList>;
  onScrollEndDrag: () => void;
  onMomentumScrollEnd: () => void;
  paddingTopHeight: number;
  tabViewContainerMinHeight: number;
};

export const FlatListTabScene = React.memo(
  ({
    userId,
    scrollY,
    tabViewRef,
    onScrollEndDrag,
    onMomentumScrollEnd,
    renderData,
    renderItem,
    paddingTopHeight,
    tabViewContainerMinHeight,
  }: FlatListTabSceneProps) => {
    const [refreshing, setRefreshing] = useState(false);

    const {refreshUser} = useRefreshUser();

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await refreshUser({userId});
      setRefreshing(false);
    }, [refreshUser, userId]);

    return (
      <Animated.FlatList
        ref={tabViewRef}
        data={renderData}
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

    const {refreshUser} = useRefreshUser();

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await refreshUser({userId});
      setRefreshing(false);
    }, [refreshUser, userId]);

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
