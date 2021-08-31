import React from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {Button} from 'react-native-elements';

export const Screen2 = () => {
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
          なおこの設定はお使いの端末から再度設定することができます👍
        </Text>
        <Button
          title="位置情報を設定する"
          activeOpacity={1}
          buttonStyle={styles.button}
          containerStyle={{marginTop: 30}}
          titleStyle={{fontWeight: 'bold'}}
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
    backgroundColor: '#ff6e7f',
  },
});
