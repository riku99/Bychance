import React from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {defaultTheme} from '~/theme';

type Props = {
  swipeRef: React.RefObject<Swiper>;
  index: number;
};

export const AboutLocation = ({swipeRef, index}: Props) => {
  const onButtonPress = async () => {
    await BackgroundGeolocation.requestPermission();
    await BackgroundGeolocation.start();
    swipeRef.current?.scrollTo(index + 1);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>位置情報について</Text>
        <Text style={styles.desc}>
          アプリの機能は基本的に位置情報を必要としています。
          {'\n'}
          {'\n'}
          そのため位置情報を有効にすることをオススメします✨
          {'\n'}
          {'\n'}
          また、バックグラウンド状態で使うためには「常に許可」を選択してください!
          {'\n'}
          {'\n'}
          なおこの設定はお使いの端末から再度設定することができます👍
        </Text>
        <Button
          title="位置情報を設定する"
          activeOpacity={1}
          buttonStyle={styles.button}
          containerStyle={{marginTop: 30}}
          titleStyle={{fontWeight: 'bold'}}
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
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 20,
  },
  desc: {
    marginTop: 20,
    fontSize: 17,
    color: '#7a7a7a',
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: defaultTheme.pinkGrapefruit,
  },
});
