import React, {useLayoutEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {AuthNavigationProp, AuthRouteProp} from '~/navigations/Auth';
import {AuthCodeForm} from '~/components/utils/Forms';
import {Button} from 'react-native-elements';
import {defaultTheme} from '~/theme';
import {useVerifyAuthCode} from '~/hooks/authCode';
import {useToastLoading} from '~/hooks/appState';
import {useSignUp} from '~/hooks/auth';

export const AuthCode = () => {
  const navigation = useNavigation<AuthNavigationProp<'AuthCode'>>();
  const {email, password, name} = useRoute<AuthRouteProp<'AuthCode'>>().params;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '認証コードの確認',
    });
  }, [navigation]);

  const {createUser} = useSignUp();
  const {verifyAuthCode} = useVerifyAuthCode();
  const {setToastLoading} = useToastLoading();
  const [code, setCode] = useState('');

  const onButtonPress = () => {
    Alert.alert(
      'コードの認証',
      '認証が成功した場合アカウントが作成されます。',
      [
        {
          text: '認証',
          onPress: async () => {
            setToastLoading(true);
            const codeResult = await verifyAuthCode(code);
            if (codeResult) {
              await createUser({email, password, name});
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
    <View style={styles.container}>
      <View style={{width: '70%'}}>
        <AuthCodeForm
          inputContainer={styles.inputContainer}
          onChangeText={setCode}
        />
        <Button
          title="認証する"
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          activeOpacity={1}
          onPress={onButtonPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 50,
  },
  buttonTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    backgroundColor: defaultTheme.pinkGrapefruit,
  },
});
