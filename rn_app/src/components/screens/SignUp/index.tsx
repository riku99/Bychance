import React, {useLayoutEffect} from 'react';
import {StyleSheet, View, Pressable, Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import {AuthNavigationProp} from '~/navigations/Auth';
import {defaultTheme} from '~/theme';
import {EmailForm, PasswordForm, NameForm} from '~/components/utils/Forms';

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
        <EmailForm />
        <PasswordForm inputContainer={styles.inputContainer} />
        <NameForm inputContainer={styles.inputContainer} />

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
    marginTop: 20,
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
