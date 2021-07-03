import React, {useState} from 'react';
import {Image, View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Button} from 'react-native-elements';
import Logo from '~/assets/logo.svg';

const lineBase = require('../../../assets/btn_base.png');
const linePress = require('../../../assets/btn_press.png');

type Props = {
  login: () => void;
  sampleLogin: () => void;
};

export const Auth = ({login, sampleLogin}: Props) => {
  const [pressLoginButton, setPressLoginButton] = useState(false);

  const onLoginPressIn = () => {
    setPressLoginButton(true);
  };

  const onLoginPressout = () => {
    setPressLoginButton(false);
  };

  const onLoginPress = () => {
    login();
  };

  return (
    <View style={styles.container}>
      <Logo height={100} width="75%" style={styles.logoContainer} />

      <View style={styles.loginContainer}>
        <Text style={styles.loginDescriptionText}>
          現在Lineログインのみ利用できます
        </Text>
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.loginButtonContainer,
            {backgroundColor: !pressLoginButton ? '#00C300' : '#00B300'},
          ]}
          onPress={onLoginPress}
          onPressIn={onLoginPressIn}
          onPressOut={onLoginPressout}>
          <Image
            source={!pressLoginButton ? lineBase : linePress}
            height={30}
            width={30}
            style={styles.iconContainer}
            resizeMode="contain"
          />
          <View style={styles.loginTextContainer}>
            <Text style={styles.loginText}>Lineログイン</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.termsUseDescription}>
          ログインすることで、
          <TouchableOpacity activeOpacity={1}>
            <Text style={styles.termsUserLink}>利用規約</Text>
          </TouchableOpacity>
          と
          <TouchableOpacity activeOpacity={1}>
            <Text style={styles.termsUserLink}>プライバシーポリシー</Text>
          </TouchableOpacity>
          に同意したものとみなされます。
        </Text>
      </View>

      {/* <Button
        title="Sample Login"
        containerStyle={styles.sampleLoginButton}
        onPress={sampleLogin}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  loginContainer: {
    marginTop: '35%',
  },
  logoContainer: {
    marginTop: '45%',
    alignSelf: 'center',
  },
  loginButtonContainer: {
    width: '85%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 3,
  },
  iconContainer: {
    height: 35,
    width: 35,
    marginLeft: 8,
  },
  loginTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginDescriptionText: {
    color: 'gray',
  },
  termsUseDescription: {
    marginTop: 70,
    color: 'gray',
  },
  termsUserLink: {
    textDecorationLine: 'underline',
    color: '#30beff',
  },
});
