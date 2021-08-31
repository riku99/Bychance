import React, {useCallback, useRef} from 'react';
import {View, StyleSheet, SafeAreaView, Text, ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

type Props = {
  swipreRef: React.RefObject<Swiper>;
};

export const Screen3 = ({swipreRef}: Props) => {
  const setPrivateZone = useRef(false);
  const navigation = useNavigation();

  const swipe = useCallback(() => {
    if (setPrivateZone.current) {
      console.log('to');
      swipreRef.current?.scrollTo(3);
    }
  }, [swipreRef]);

  useFocusEffect(swipe);

  const onButtonPress = () => {
    // goto PrivateZone
    setPrivateZone.current = true;
    navigation.navigate('PrivateConfig', {goTo: 'zone'});
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollContents}>
          <Text style={styles.title}>自分の表示について</Text>
          <Text style={styles.desc}>
            <Text style={{color: '#ff5454'}}>
              少し長いですが必ず全てお読みください
            </Text>
            {'\n'}
            {'\n'}
            アプリの中で自分の周りのユーザーをマップやリストに表示させて、プロフィールを見たり、メッセージを送ったりすることができます😍
            {'\n'}
            {'\n'}
            逆に自分のことも他のユーザーに表示させることができます(初期設定では非表示になっています)☀️
            {'\n'}
            {'\n'}
            自分を表示させる場合でも自宅や職場などの「ある特定の場所」では表示させたくないということがあると思います。
            {'\n'}
            {'\n'}
            そのような場所を「プライベートゾーン」として設定してください。
            {'\n'}
            設定した場所から一定の範囲内にいる場合は他のユーザーに表示されなくなります。
            {'\n'}
            {'\n'}
            この設定はあとでメニューの「自分の表示」→
            「プライベートゾーンの設定」から追加、削除できます。
            {'\n'}
            {'\n'}
            なお、プライベートゾーンにいる場合でも自分を他のユーザーに表示させたくない場合は設定で「自分を表示する」をオフにすることをオススメします🤝
          </Text>
          <Button
            title="プライベートゾーンを設定"
            buttonStyle={styles.button}
            containerStyle={{marginTop: 20}}
            titleStyle={{fontWeight: 'bold'}}
            activeOpacity={1}
            onPress={onButtonPress}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContents: {},
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
    backgroundColor: '#ff6e7f',
  },
});
