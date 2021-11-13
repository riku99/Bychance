import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Keyboard, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import {AuthNavigationProp} from '~/navigations/Auth';
import {defaultTheme} from '~/theme';
import {EmailForm, PasswordForm, NameForm} from '~/components/utils/Forms';
import {useConfirmationOfImail} from '~/hooks/auth';

export const SignUp = () => {
  const navigation = useNavigation<AuthNavigationProp<'SignUp'>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'アカウント登録',
    });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const {confirmEmail} = useConfirmationOfImail();

  const onButtonPress = () => {
    Alert.alert(
      '認証コードの送信',
      '指定したアドレスに認証コードが送信されます。',
      [
        {
          text: '送信',
          onPress: async () => {
            const validEmail = await confirmEmail(email);
            if (validEmail) {
              navigation.navigate('AuthCode', {
                email,
                password,
                name,
              });
            }
          },
        },
        {
          text: 'キャンセル',
        },
      ],
    );
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
        <NameForm
          inputContainer={styles.inputContainer}
          onChangeText={setName}
        />

        <Button
          title="認証コード送信"
          titleStyle={styles.buttonTitle}
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          activeOpacity={1}
          // disabled={!email || password.length < 8 || !name}
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
