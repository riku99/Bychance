import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {AuthNavigationProp} from '~/navigations/Auth';
import {EmailForm, PasswordForm} from '~/components/utils/Forms';

export const SignIn = () => {
  const navigation = useNavigation<AuthNavigationProp<'SignIn'>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'ログイン',
    });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
});
