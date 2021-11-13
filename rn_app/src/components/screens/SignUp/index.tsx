import React, {useLayoutEffect} from 'react';
import {StyleSheet, View, TextInput, Pressable, Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import {AuthNavigationProp} from '~/navigations/Auth';
import {defaultTheme} from '~/theme';

export const SignUp = () => {
  const navigation = useNavigation<AuthNavigationProp<'SignUp'>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'アカウント登録',
    });
  }, [navigation]);

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.contents}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="メールアドレス"
            style={{width: '100%', fontSize: 16}}
          />
        </View>

        <View style={[styles.inputContainer, {marginTop: 20}]}>
          <TextInput
            placeholder="パスワード"
            style={{width: '100%', fontSize: 16}}
            textContentType="password"
            secureTextEntry
          />
        </View>

        <View style={[styles.inputContainer, {marginTop: 20}]}>
          <TextInput placeholder="名前" style={{width: '100%', fontSize: 16}} />
        </View>

        <Button
          title="次へ"
          titleStyle={styles.buttonTitle}
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          activeOpacity={1}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  contents: {
    paddingHorizontal: 25,
    paddingTop: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonTitle: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: defaultTheme.pinkGrapefruit,
  },
  buttonContainer: {
    marginTop: 40,
  },
});
