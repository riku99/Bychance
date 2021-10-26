import React, {useCallback, useRef} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import {StackNavigationProp} from '@react-navigation/stack';

import {Desc} from './Desc';
import {Title} from './Title';
import {NextButton} from './NextButton';
import {IntroStackParamList} from '~/navigations/Intro';

type Props = {
  swipeRef: React.RefObject<Swiper>;
  index: number;
};

export const AboutPrivateZone = ({swipeRef, index}: Props) => {
  const setPrivateZone = useRef(false);
  const navigation = useNavigation<
    StackNavigationProp<IntroStackParamList, 'Intro'>
  >();

  const swipe = useCallback(() => {
    if (setPrivateZone.current) {
      swipeRef.current?.scrollTo(index + 1);
    }
  }, [swipeRef, index]);

  useFocusEffect(swipe);

  const onButtonPress = () => {
    setPrivateZone.current = true;
    navigation.navigate('PrivateConfig', {goTo: 'zone'});
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Title>プライベートゾーンについて</Title>
        <Desc>
          プライベートゾーンを設定すると、その場所から一定の範囲内にいる場合は他のユーザーに自分が表示されなくなります。
          {'\n'}
          {'\n'}
          <Text style={{color: 'red'}}>
            必ずプライベートゾーンを設定してください
          </Text>
          {'\n'}
          {'\n'}
          この設定はあとでメニューの「自分の表示」→
          「プライベートゾーンの設定」から追加、削除できます。
        </Desc>
        <NextButton
          title="プライベートゾーンを設定"
          containerStyle={{marginTop: 30}}
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
