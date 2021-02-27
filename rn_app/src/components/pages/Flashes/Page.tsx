import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ShowFlash} from './ShowFlash';
import {FlashesRouteProp, RootNavigationProp} from '../../../screens/types';
import {FlashesStackParamList} from '../../../screens/Flashes';
import {X_HEIGHT} from '../../../constants/device';
import {RootState} from '../../../redux/index';
import {selectAllFlashes} from '../../../redux/flashes';
import {FlashesData} from './types';

type Props = {
  route: FlashesRouteProp<'Flashes'>;
  navigation: RootNavigationProp<'Flashes'>;
};

export const FlashesPage = ({route, navigation}: Props) => {
  const {isMyData, startingIndex, dataArray} = route.params;

  const flatListRef = useRef<FlatList>(null);

  const myFlashes = useSelector((state: RootState) => {
    if (isMyData) {
      const flashes = selectAllFlashes(state);
      if (flashes) {
        return flashes;
      } else {
        throw new Error('存在しません');
      }
    }
  }, shallowEqual);

  // FlatListに渡される複数のアイテムのうち、どのアイテムが実際に画面に表示されているのかを管理るためのオブジェクト
  const [displayManagementTable, setDisplayManagementTable] = useState(() => {
    let obj: {[key: number]: boolean} = {};
    if (!isMyData) {
      for (let i = 0; i < dataArray.length; i++) {
        obj[i] = i === startingIndex ? true : false;
      }
    } else {
      obj[startingIndex] = true;
    }
    return obj;
  });

  // 現在表示されているアイテム(displayManagementTableで値がtureになっているプロパティである番号)をRefで管理
  const currentDisplayedIndex = useRef(startingIndex);

  // アイテムがラストのものだったらバックスクリーン、次がある場合はscrollToindexで次のアイテムを表示(FlastListなのでここでレンダリング)
  const scrollToNextOrBackScreen = useCallback(() => {
    if (flatListRef.current) {
      if (currentDisplayedIndex.current < dataArray.length - 1) {
        flatListRef.current.scrollToIndex({
          index: currentDisplayedIndex.current + 1,
        });
      } else {
        navigation.goBack();
      }
    }
  }, [dataArray.length, navigation]);
  // statusBarの設定のためにデバイスがX以上であるかどうかを判定
  // 判断方法の正解がわからなかったのでとりあえずデバイスの大きさで判断
  const moreDeviceX = useMemo(() => {
    return height >= X_HEIGHT ? true : false;
  }, []);

  const [scrolling, setScrolling] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // 個々の環境によってstatuBarの設定を変更
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      StatusBar.setHidden(!moreDeviceX ? true : false);
      StatusBar.setBarStyle('light-content');
    });

    return unsubscribe;
  }, [navigation, moreDeviceX]);

  // このページではstatusBarの設定を環境によって変えるので、このページからブラーする時はその設定を元に戻す
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('default');
    });

    return unsubscribe;
  }, [navigation]);

  // そのデバイスのsafeareaのtopとbottomの高さを取得
  const {top, bottom} = useSafeAreaInsets();

  // 取得したsafeareaのtopとbottomから実際に表示する要素のheightを取得
  // UI表示までのプロセスの都合上、SafeAreaViewではなくこのようにして計算
  const safeAreaHeight = useMemo(() => {
    return moreDeviceX ? height - top - bottom : height;
  }, [top, bottom, moreDeviceX]);

  // FlatListのdataに渡した配列(dataArray)の中のアイテムが{item}に渡される
  // flashesDataが存在しない場合は自分のデータを表示する時なのでセレクタで取得したデータを使いオブジェクトを生成
  // そうでない場合はそのまま返す
  const getData = ({
    item,
  }: {
    item: FlashesStackParamList['Flashes']['dataArray'][number];
  }): {
    flashesData: FlashesData;
    userData: FlashesStackParamList['Flashes']['dataArray'][number]['userData'];
  } => {
    if (item.flashesData) {
      return item;
    } else {
      return {
        flashesData: {
          entities: myFlashes!,
          alreadyViewed: [],
          isAllAlreadyViewed: false,
        },
        userData: item.userData,
      };
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!scrolling) {
      setScrolling(true);
    }
    // offset.yがheightで割り切れる、つまり画面内の要素が完全に切り替わった時
    if (e.nativeEvent.contentOffset.y % safeAreaHeight === 0) {
      const displayedElementIndex =
        e.nativeEvent.contentOffset.y / safeAreaHeight; // 何番目のアイテムが表示されたかをoffsetから計算し取得
      // 表示状態を切り替える
      setDisplayManagementTable({
        ...displayManagementTable,
        [currentDisplayedIndex.current]: false,
        [displayedElementIndex]: true,
      });
      currentDisplayedIndex.current = displayedElementIndex;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {paddingTop: moreDeviceX ? top : 0, paddingBottom: bottom},
      ]}>
      <FlatList
        ref={flatListRef}
        data={dataArray}
        keyExtractor={(item) => item.userData.userId.toString()}
        renderItem={({item, index}) => (
          <View style={{height: safeAreaHeight, width}}>
            <ShowFlash
              flashesData={getData({item}).flashesData}
              userData={getData({item}).userData}
              isDisplayed={displayManagementTable[index]}
              scrolling={scrolling}
              showModal={showModal}
              setShowModal={setShowModal}
              scrollToNextOrBackScreen={scrollToNextOrBackScreen}
            />
          </View>
        )}
        onScrollEndDrag={() => setScrolling(false)}
        onMomentumScrollEnd={() => setScrolling(false)}
        onScroll={(e) => onScroll(e)}
        decelerationRate="fast"
        snapToInterval={safeAreaHeight}
        getItemLayout={(data, index) => ({
          length: safeAreaHeight,
          offset: safeAreaHeight * index,
          index,
        })}
        scrollEnabled={!showModal}
        initialScrollIndex={startingIndex}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={1}
      />
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
