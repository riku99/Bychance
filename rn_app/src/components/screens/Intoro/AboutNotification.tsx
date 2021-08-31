import React from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';

type Props = {
  swipeRef: React.RefObject<Swiper>;
  index: number;
};

export const AboutNotification = ({swipeRef, index}: Props) => {
  const onButtonPress = () => {
    // TODO: プッシュ通知の設定
    swipeRef.current?.scrollTo(index + 1);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>プッシュ通知について</Text>
        <Text style={styles.desc}>
          アプリ内でメッセージの受信などを通知します
          {'\n'}
          {'\n'}
          なおこの設定はお使いの端末から再度設定することができます👍
        </Text>
        <Button
          title="設定する"
          buttonStyle={styles.button}
          titleStyle={{fontWeight: 'bold'}}
          containerStyle={{marginTop: 30}}
          onPress={onButtonPress}
          activeOpacity={1}
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
  button: {
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#ff6e7f',
  },
  desc: {
    marginTop: 20,
    fontSize: 17,
    color: '#7a7a7a',
    fontWeight: 'bold',
  },
});
