import React from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {Button} from 'react-native-elements';

export const Last = () => {
  const onButtonPress = () => {
    // ToDo: settingでintro画面消す
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>お疲れ様でした</Text>
        <Text style={styles.thank}>
          他にも設定できることがあるので確認してみてください!
          {'\n'}
          {'\n'}
          ご協力ありがとうございました!😍
        </Text>
        <Button
          title="開始する"
          containerStyle={{marginTop: 40}}
          buttonStyle={styles.button}
          titleStyle={{fontWeight: 'bold'}}
          activeOpacity={1}
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
  thank: {
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
