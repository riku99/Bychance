import React from 'react';
import {View, TextInput, StyleSheet, StyleProp, ViewStyle} from 'react-native';

type Props = {
  inputContainer?: StyleProp<ViewStyle>;
  onChangeText?: (t: string) => void;
};

export const EmailForm = ({inputContainer, onChangeText}: Props) => {
  return (
    <View style={[styles.inputContainer, inputContainer]}>
      <TextInput
        placeholder="メールアドレス"
        style={styles.input}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export const PasswordForm = ({inputContainer, onChangeText}: Props) => {
  return (
    <View style={[styles.inputContainer, inputContainer]}>
      <TextInput
        placeholder="パスワード(8文字以上)"
        style={styles.input}
        textContentType="password"
        secureTextEntry
        onChangeText={onChangeText}
      />
    </View>
  );
};

export const NameForm = ({inputContainer, onChangeText}: Props) => {
  return (
    <View style={[styles.inputContainer, inputContainer]}>
      <TextInput
        placeholder="名前"
        style={styles.input}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export const AuthCodeForm = ({inputContainer, onChangeText}: Props) => {
  return (
    <View style={[styles.inputContainer, inputContainer]}>
      <TextInput
        placeholder="認証コード"
        style={styles.input}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    fontSize: 16,
  },
});
