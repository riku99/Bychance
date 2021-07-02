import React, {useState} from 'react';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import Logo from '~/assets/logo.svg';

const lineBase = require('../../../assets/btn_login_base.png');
const linePress = require('../../../assets/btn_login_press.png');

type Props = {
  login: () => void;
  sampleLogin: () => void;
};

export const Auth = ({login, sampleLogin}: Props) => {
  const [pressLoginButton, setPressLoginButton] = useState(false);
  return (
    <View style={styles.container}>
      <Logo
        onLayout={(e) => console.log(e.nativeEvent)}
        height={100}
        width="75%"
        style={{marginTop: '45%', alignSelf: 'center'}}
      />
      <TouchableOpacity
        activeOpacity={1}
        style={styles.loginButtonContainer}
        onPressIn={() => {
          setPressLoginButton(true);
          login();
        }}
        onPressOut={() => {
          setPressLoginButton(false);
        }}>
        {!pressLoginButton ? (
          <Image source={lineBase} />
        ) : (
          <Image source={linePress} />
        )}
      </TouchableOpacity>
      <Button
        title="Sample Login"
        containerStyle={styles.sampleLoginButton}
        onPress={sampleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  loginButtonContainer: {
    position: 'absolute',
    bottom: '25%',
  },
  sampleLoginButton: {
    position: 'absolute',
    bottom: '10%',
  },
});
