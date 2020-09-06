import React, {useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import LineLogin from '@xmartlabs/react-native-line';
import axios from 'axios';

const App: () => React.ReactNode = () => {
  useEffect(() => {
    let login = async () => {
      try {
        const loginResult = await LineLogin.login({
          scopes: ['openid'],
        });
        // IDトークンをAPIに送信
        // ...APIで検証...
        // APIから返ってきたユーザー情報を取得
        // キーチェーンに保存
        // ユーザー情報をdispatchしreduxに保存
        console.log(loginResult);
      } catch (e) {
        console.log(e.message);
      }
    };

    login();
  }, []);
  return (
    <>
      <View style={styles.container}>
        <Text>hello world!</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

//riku09161@i.softbank.jp
