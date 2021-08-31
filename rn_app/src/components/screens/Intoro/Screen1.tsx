import React from 'react';
import {View, StyleSheet, Text, SafeAreaView} from 'react-native';
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';

import {Check} from './Check';

type Props = {
  swipreRef: React.RefObject<Swiper>;
};

export const Screen1 = ({swipreRef}: Props) => {
  const onPress = () => {
    swipreRef.current?.scrollTo(1);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.contents}>
        <Text style={styles.hello}>ようこそ!</Text>
        <Text style={styles.what}>
          このアプリは、自分の周りの何気ない出来事やお店・イベント・人をちょっとだけ繋ぐ、そんなSNSです❣️
          {'\n'}
          {'\n'}
          みんなが気持ちよく使えるように以下のことに同意してください。
        </Text>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Check />
            <Text style={styles.itemTitle}>
              プロフィールに嘘は書かない、載せない
            </Text>
          </View>
          <View style={styles.listItem}>
            <Check />
            <Text style={styles.itemTitle}>
              メッセージをあまりにしつこくしない
              {'\n'}
              (設定で受け取らないようにできます)
            </Text>
          </View>
          <View style={styles.listItem}>
            <Check />
            <Text style={styles.itemTitle}>
              ストーカー的行為は絶対にしない
              {'\n'}
              (設定で非表示にできます)
            </Text>
          </View>
        </View>
        <Button
          title="同意する"
          titleStyle={{fontWeight: 'bold'}}
          activeOpacity={1}
          containerStyle={{marginTop: 50}}
          buttonStyle={styles.button}
          onPress={onPress}
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
  contents: {},
  hello: {
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 20,
  },
  what: {
    marginTop: 20,
    fontSize: 17,
    color: '#7a7a7a',
    fontWeight: 'bold',
  },
  list: {
    marginTop: 25,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  itemTitle: {
    fontSize: 15,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#ff6e7f',
  },
});
