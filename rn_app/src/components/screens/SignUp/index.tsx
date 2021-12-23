import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Keyboard, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import {AuthNavigationProp} from '~/navigations/Auth';
import {defaultTheme} from '~/theme';
import {EmailForm, PasswordForm, NameForm} from '~/components/utils/Forms';
import {useConfirmationOfEmail} from '~/hooks/auth';
import {useCreateAuthCodeAndSendEmail} from '~/hooks/authCode';
import {useToastLoading} from '~/hooks/appState';

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

  const {setToastLoading} = useToastLoading();
  const {confirmEmail} = useConfirmationOfEmail();
  const {createAuthCodeAndSendEmail} = useCreateAuthCodeAndSendEmail();

  const onButtonPress = () => {
    Alert.alert(
      '認証コードの送信',
      '指定したアドレスに認証コードが送信されます。',
      [
        {
          text: '送信',
          onPress: async () => {
            setToastLoading(true);
            const validEmail = await confirmEmail(email);
            if (validEmail) {
              const result = await createAuthCodeAndSendEmail(email);
              if (result) {
                navigation.navigate('AuthCode', {
                  email,
                  password,
                  name,
                });
              }
            }
            setToastLoading(false);
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
          disabled={!email || password.length < 8 || !name}
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
    backgroundColor: defaultTheme.primary,
    height: 40,
  },
  buttonContainer: {
    marginTop: 40,
  },
});
