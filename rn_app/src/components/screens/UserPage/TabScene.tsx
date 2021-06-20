import React, {useCallback, useState} from 'react';
import {
  Animated,
  ScrollView,
  RefreshControl,
  ListRenderItem,
  FlatList,
} from 'react-native';

import {refreshUserThunk} from '../../../thunks/users/refreshUser';
import {Post} from '~/stores/posts';
import {useCustomDispatch} from '~/hooks/stores';

type FlatListTabSceneProps = {
  renderItem?: ListRenderItem<Post>;
  renderData?: Post[];
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
    const dispatch = useCustomDispatch();
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
    const dispatch = useCustomDispatch();
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
