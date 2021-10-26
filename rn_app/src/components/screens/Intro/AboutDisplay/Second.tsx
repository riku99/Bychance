import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Swiper from 'react-native-swiper';

import {Desc} from '../Desc';
import {Title} from '../Title';
import {NextButton} from '../NextButton';

type Props = {
  swipeRef: React.RefObject<Swiper>;
  index: number;
};

export const Second = ({swipeRef, index}: Props) => {
  const onButtonPress = async () => {
    swipeRef.current?.scrollTo(index + 1);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Title>自分の表示について②</Title>
        <Desc>
          自宅や職場など
          {'\n'}
          「ここでは他のユーザーに自分を表示させたくない!!」
          {'\n'}
          という場所があると思います🤔
          {'\n'}
          {'\n'}
          そのような場所を「プライベートゾーン」として設定してください。
        </Desc>
        <NextButton
          title="読んだ👀"
          containerStyle={{marginTop: 40}}
          onPress={onButtonPress}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
