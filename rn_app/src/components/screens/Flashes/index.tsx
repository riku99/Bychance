import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';

import {ShowFlash} from './ShowFlash';
import {FlashesRouteProp} from '../../../navigations/types';
import {RootNavigationProp} from '~/navigations/Root';
import {judgeMoreDeviceX} from '~/helpers/device';
import {RootState} from '~/stores';
import {selectFlashesByUserIds} from '~/stores/flashes';

type Props = {
  route: FlashesRouteProp<'Flashes'>;
  navigation: RootNavigationProp<'Flashes'>;
};

export const FlashesPage = ({route, navigation}: Props) => {
  const {startingIndex, userIds} = route.params;
  const data = useSelector(
    (state: RootState) => selectFlashesByUserIds(state, userIds),
    shallowEqual,
  );

  const flatListRef = useRef<FlatList>(null);

  // FlatListに渡される複数のアイテムのうち、どのアイテムが実際に画面に表示されているのかを管理るためのオブジェクト
  const [displayManagementTable, setDisplayManagementTable] = useState(() => {
    let obj: {[key: number]: boolean} = {};
    for (let i = 0; i < data.length; i++) {
      obj[i] = i === startingIndex ? true : false;
    }
    return obj;
  });

  // 現在表示されているアイテム(displayManagementTableで値がtureになっているプロパティである番号)をRefで管理
  const currentDisplayedIndex = useRef(startingIndex);

  // アイテムがラストのものだったらバックスクリーン、次がある場合はscrollToindexで次のアイテムを表示(FlastListなのでここでレンダリング)
  const scrollToNextOrBackScreen = useCallback(() => {
    if (flatListRef.current) {
      if (currentDisplayedIndex.current < data.length - 1) {
        flatListRef.current.scrollToIndex({
          index: currentDisplayedIndex.current + 1,
        });
      } else {
        navigation.goBack();
      }
    }
  }, [data.length, navigation]);

  const [scrolling, setScrolling] = useState(false);

  // 個々の環境によってstatuBarの設定を変更
  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', () => {
      StatusBar.setHidden(!moreDeviceX ? true : false, 'fade');
      StatusBar.setBarStyle('light-content');
    });

    return unsubscribe;
  }, [navigation]);

  // このページではstatusBarの設定を環境によって変えるので、このページからブラーする時はその設定を元に戻す
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('default');
    });

    return unsubscribe;
  }, [navigation]);

  // Top以外からスタートの時(startingIndexが0以外)その画面から始まるが、内部的にはスクロールされることになる
  // そのスクロールが完了したかのデータを保持
  const initialScrollToStartingIndex = useRef(startingIndex ? true : false);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!scrolling && !initialScrollToStartingIndex.current) {
      setScrolling(true);
    }
    // offset.yがheightで割り切れる、つまり画面内の要素が完全に切り替わった時
    if (e.nativeEvent.contentOffset.y % height === 0) {
      const displayedElementIndex = e.nativeEvent.contentOffset.y / height; // 何番目のアイテムが表示されたかをoffsetから計算し取得
      // 表示状態を切り替える
      setDisplayManagementTable({
        ...displayManagementTable,
        [currentDisplayedIndex.current]: false,
        [displayedElementIndex]: true,
      });
      currentDisplayedIndex.current = displayedElementIndex;
    }

    if (initialScrollToStartingIndex.current) {
      initialScrollToStartingIndex.current = false;
    }
  };

  useEffect(() => {
    if (!data[0].length) {
      navigation.goBack();
    }
  }, [data, navigation]);

  if (!data[0].length) {
    return <View style={styles.container} />;
  }

  return (
    <View style={[styles.container]}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({item, index}) => (
          <View style={{height, width}}>
            <ShowFlash
              flashes={item}
              user={{id: userIds[index]}}
              isDisplayed={displayManagementTable[index]}
              scrolling={scrolling}
              scrollToNextOrBackScreen={scrollToNextOrBackScreen}
            />
          </View>
        )}
        onScrollEndDrag={() => setScrolling(false)}
        onMomentumScrollEnd={() => setScrolling(false)}
        onScroll={(e) => onScroll(e)}
        decelerationRate="fast"
        snapToInterval={height}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        // scrollEnabled={!showModal}
        initialScrollIndex={startingIndex}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={10}
      />
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const moreDeviceX = judgeMoreDeviceX();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
