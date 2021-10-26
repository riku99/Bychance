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

export const First = ({swipeRef, index}: Props) => {
  const onButtonPress = async () => {
    swipeRef.current?.scrollTo(index + 1);
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Title>自分の表示について①</Title>
        <Desc>
          アプリの中で自分の周辺のユーザーをマップやリストに表示させて、プロフィールを見たり、メッセージを送ったりすることができます😍
          {'\n'}
          {'\n'}
          逆に自分のことも他のユーザーに表示させることができます(初期設定では非表示になっています)☀️
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
