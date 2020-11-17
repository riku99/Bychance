import React, {useState} from 'react';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';

const lineBase = require('../../assets/btn_login_base.png');
const linePress = require('../../assets/btn_login_press.png');

type Props = {
  login: () => void;
  sampleLogin: () => void;
};

export const Auth = ({login, sampleLogin}: Props) => {
  const [pressLoginButton, setPressLoginButton] = useState(false);
  return (
    <View style={styles.container}>
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
