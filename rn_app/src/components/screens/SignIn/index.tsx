import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import {AuthNavigationProp} from '~/navigations/Auth';
import {EmailForm, PasswordForm} from '~/components/utils/Forms';
import {defaultTheme} from '~/theme';
import {useLogin} from '~/hooks/sessions';

export const SignIn = () => {
  const navigation = useNavigation<AuthNavigationProp<'SignIn'>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'ログイン',
    });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useLogin();
  const onButtonPress = async () => {
    await login({email, password});
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.contents}>
        <EmailForm onChangeText={setEmail} />
        <PasswordForm
          inputContainer={styles.inputContainer}
          onChangeText={setPassword}
        />
        <Button
          title="ログイン"
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          activeOpacity={1}
          disabled={!email || password.length < 8}
          onPress={onButtonPress}
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
    marginTop: 20,
  },
  buttonTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: defaultTheme.pinkGrapefruit,
  },
  buttonContainer: {
    marginTop: 40,
  },
});
