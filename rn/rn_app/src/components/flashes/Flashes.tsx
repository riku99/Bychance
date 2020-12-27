import React, {useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList, StatusBar} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {Container as ShowFlash} from '../../containers/flashs/ShowFlash';
import {RootStackParamList} from '../../screens/Root';
import {FlashStackParamList} from '../../screens/Flash';
import {X_HEIGHT} from '../../constants/device';

type FlashRouteProp = RouteProp<FlashStackParamList, 'Flashes'>;

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Flashes'>;

type Props = {
  route: FlashRouteProp;
  navigation: RootNavigationProp;
};

export const Flashes = ({route, navigation}: Props) => {
  const routePrams = route.params;

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

  const goBackScreen = () => {
    navigation.goBack();
    if (height < X_HEIGHT) {
      StatusBar.setHidden(false);
    } else {
      StatusBar.setBarStyle('default');
    }
  };

  return (
    <View style={styles.contaienr}>
      <FlatList
        keyExtractor={(item) => item.user.id.toString()}
        ref={flatListRef}
        data={routePrams.allFlashesWithUser}
        renderItem={({item, index}) => (
          <View style={{width, height}}>
            <ShowFlash
              flashData={item}
              isDisplayed={isDisplayedList[index]}
              scrollToNextOrBackScreen={scrollToNextOrBackScreen}
              goBackScreen={goBackScreen}
            />
          </View>
        )}
        onScroll={(e) => {
          // offset.yがheightで割り切れる、つまり画面内の要素が完全に切り替わった時
          if (e.nativeEvent.contentOffset.y % height === 0) {
            const displayedElementIndex =
              e.nativeEvent.contentOffset.y / height; // 表示されている要素のインデックス
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
        snapToInterval={height}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        initialScrollIndex={routePrams.index}
      />
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  contaienr: {
    flex: 1,
    backgroundColor: 'black',
  },
});
