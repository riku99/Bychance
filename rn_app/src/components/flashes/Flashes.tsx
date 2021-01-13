import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList, StatusBar} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ShowFlash} from './ShowFlash';
import {RootStackParamList} from '../../screens/Root';
import {FlashStackParamList} from '../../screens/Flash';
import {X_HEIGHT} from '../../constants/device';
import {RootState} from '../../redux/index';
import {selectAllFlashes} from '../../redux/flashes';

type FlashRouteProp = RouteProp<FlashStackParamList, 'showFlashes'>;

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Flashes'>;

type Props = {
  route: FlashRouteProp;
  navigation: RootNavigationProp;
};

export const Flashes = ({route, navigation}: Props) => {
  const routePrams = route.params;

  // 自分のデータを表示する時のみtrue
  const needSelector = routePrams.allFlashesWithUser[0].flashes ? false : true;

  const myFlashes = useSelector((state: RootState) => {
    if (needSelector) {
      return selectAllFlashes(state);
    }
  }, shallowEqual);

  const [isDisplayedList, setIsDisplayedList] = useState(() => {
    let obj: {[key: number]: boolean} = {};
    for (let i = 0; i < routePrams.allFlashesWithUser.length; i++) {
      obj[i] = i === routePrams.index ? true : false;
    }
    return obj;
  });

  const flatListRef = useRef<FlatList>(null);

  const currentDisplayedIndex = useRef(routePrams.index);

  const scrollToNextOrBackScreen = () => {
    if (flatListRef.current) {
      if (
        currentDisplayedIndex.current <
        routePrams.allFlashesWithUser.length - 1
      ) {
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
        keyExtractor={(item) => item.user.id.toString()}
        ref={flatListRef}
        data={routePrams.allFlashesWithUser}
        renderItem={({item, index}) => (
          <View style={{height: safeAreaHeight, width}}>
            <ShowFlash
              flashData={
                !needSelector
                  ? item
                  : {
                      flashes: {
                        entities: myFlashes,
                        alreadyViewed: [],
                        isAllAlreadyViewed: false,
                      },
                      user: item.user,
                    }
              }
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
        initialScrollIndex={routePrams.index}
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
