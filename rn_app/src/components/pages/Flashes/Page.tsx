import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList, StatusBar} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ShowFlash} from './ShowFlash';
import {FlashesRouteProp, RootNavigationProp} from '../../../screens/types';
import {X_HEIGHT} from '../../../constants/device';
import {RootState} from '../../../redux/index';
import {selectAllFlashes} from '../../../redux/flashes';

type Props = {
  route: FlashesRouteProp<'Flashes'>;
  navigation: RootNavigationProp<'Flashes'>;
};

export const FlashesPage = ({route, navigation}: Props) => {
  const routePrams = route.params;

  // Flash[] | undefiend
  const myFlashes = useSelector((state: RootState) => {
    if (routePrams.isMyData) {
      const flashes = selectAllFlashes(state);
      if (flashes) {
        return flashes;
      } else {
        throw new Error('存在しません');
      }
    }
  }, shallowEqual);

  const [isDisplayedList, setIsDisplayedList] = useState(() => {
    let obj: {[key: number]: boolean} = {};
    if (!routePrams.isMyData) {
      for (let i = 0; i < routePrams.data.length; i++) {
        obj[i] = i === routePrams.startingIndex ? true : false;
      }
    } else {
      obj[routePrams.startingIndex] = true;
    }
    return obj;
  });

  const flatListRef = useRef<FlatList>(null);

  const currentDisplayedIndex = useRef(routePrams.startingIndex);

  const scrollToNextOrBackScreen = () => {
    if (flatListRef.current && !routePrams.isMyData) {
      if (currentDisplayedIndex.current < routePrams.data.length - 1) {
        flatListRef.current.scrollToIndex({
          index: currentDisplayedIndex.current + 1,
        });
      } else {
        navigation.goBack();
      }
    }
  };

  const moreDeviceX = useMemo(() => {
    return height >= X_HEIGHT ? true : false;
  }, []);

  const goBackScreen = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('default');
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      StatusBar.setHidden(!moreDeviceX ? true : false);
      StatusBar.setBarStyle('light-content');
    });

    return unsubscribe;
  }, [navigation, moreDeviceX]);

  const {top, bottom} = useSafeAreaInsets();
  const safeAreaHeight = useMemo(() => {
    return moreDeviceX ? height - top - bottom : height;
  }, [top, bottom, moreDeviceX]);

  return (
    <View
      style={[
        styles.container,
        {paddingTop: moreDeviceX ? top : 0, paddingBottom: bottom},
      ]}>
      <FlatList
        ref={flatListRef}
        data={routePrams.data}
        keyExtractor={(item) => item.userData.userId.toString()}
        renderItem={({item, index}) => (
          <View style={{height: safeAreaHeight, width}}>
            <ShowFlash
              flashData={
                !routePrams.isMyData
                  ? item.flashesData
                  : {
                      entities: myFlashes,
                      alreadyViewed: [],
                      isAllAlreadyViewed: false,
                    }
              }
              userData={{userId: routePrams.data[index].userData.userId}}
              isDisplayed={isDisplayedList[index]}
              scrollToNextOrBackScreen={scrollToNextOrBackScreen}
              goBackScreen={goBackScreen}
            />
          </View>
        )}
        onScroll={(e) => {
          // offset.yがheightで割り切れる、つまり画面内の要素が完全に切り替わった時
          if (e.nativeEvent.contentOffset.y % safeAreaHeight === 0) {
            const displayedElementIndex =
              e.nativeEvent.contentOffset.y / safeAreaHeight; // 表示されている要素のインデックス
            // 表示状態をpropsとして伝える
            setIsDisplayedList({
              ...isDisplayedList,
              [currentDisplayedIndex.current]: false,
              [displayedElementIndex]: true,
            });
            currentDisplayedIndex.current = displayedElementIndex;
          }
        }}
        decelerationRate="fast"
        snapToInterval={safeAreaHeight}
        getItemLayout={(data, index) => ({
          length: safeAreaHeight,
          offset: safeAreaHeight * index,
          index,
        })}
        initialScrollIndex={routePrams.isMyData ? routePrams.startingIndex : 0}
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
