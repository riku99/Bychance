import React, {useCallback, useState, useMemo} from 'react';
import {
  Animated,
  ScrollView,
  RefreshControl,
  ListRenderItem,
  FlatList,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';

import {AppDispatch} from '../../../stores/index';
import {refreshUserThunk} from '../../../apis/users/refreshUser';
import {stickyTabHeight} from './TabView';
import {Post} from '~/stores/posts';

type FlatListTabSceneProps = {
  renderItem?: ListRenderItem<Post>;
  renderData?: Post[];
  userId: string;
  scrollY: Animated.Value;
  tabViewRef: React.RefObject<FlatList>;
  onScrollEndDrag: () => void;
  onMomentumScrollEnd: () => void;
  setMostRecentlyScrolledView: () => void;
  profileContainerHeight: number;
  mostRecentlyScrolledView: 'Posts' | 'UserInformation' | null;
};

export const FlatListTabScene = React.memo(
  ({
    userId,
    scrollY,
    tabViewRef,
    onScrollEndDrag,
    onMomentumScrollEnd,
    setMostRecentlyScrolledView,
    renderData,
    renderItem,
    profileContainerHeight,
    mostRecentlyScrolledView,
  }: FlatListTabSceneProps) => {
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
      <Animated.FlatList
        ref={tabViewRef}
        data={renderData}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={3}
        horizontal={false}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingTop: paddingTopHeight}}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
          },
        )}
        onScrollEndDrag={onScrollEndDrag}
        onScrollBeginDrag={setMostRecentlyScrolledView}
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
  setMostRecentlyScrolledView: () => void;
  profileContainerHeight: number;
  containerHeight: number;
  contentsHeight: number;
  mostRecentlyScrolledView: 'Posts' | 'UserInformation' | null;
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
    containerHeight,
    mostRecentlyScrolledView,
    contentsHeight,
  }: ScrollViewTabSceneProps) => {
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

    const scrollableHeight = useMemo(() => {
      switch (mostRecentlyScrolledView) {
        case 'UserInformation':
          return paddingTopHeight;
        case 'Posts':
          return containerHeight + profileContainerHeight - contentsHeight; // 上部に到達したTabまでスクロールできる高さを持たせる
      }
    }, [
      containerHeight,
      mostRecentlyScrolledView,
      paddingTopHeight,
      profileContainerHeight,
      contentsHeight,
    ]);

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
        <>
          {children}
          <View style={{height: scrollableHeight}} />
        </>
      </Animated.ScrollView>
    );
  },
);
