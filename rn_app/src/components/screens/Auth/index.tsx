import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

import Logo from '~/assets/logo.svg';
import {AuthNavigationProp} from '~/navigations/Auth';
import {defaultTheme} from '~/theme';

export const Auth = () => {
  const navigation = useNavigation<AuthNavigationProp<'Auth'>>();

  return (
    <View style={styles.container}>
      <Logo height={100} width={CONTENT_WIDTH} style={styles.logoContainer} />

      <View style={styles.loginContainer}>
        <View style={styles.descContainer}>
          <View style={styles.descLine} />
          <Text style={styles.desc}>初めての方</Text>
          <View style={styles.descLine} />
        </View>

        <Button
          title="メールアドレスで登録"
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonContainer}
          buttonStyle={{backgroundColor: defaultTheme.pinkGrapefruit}}
          icon={{name: 'email', size: 16, color: 'white'}}
          iconContainerStyle={styles.buttonIcon}
          onPress={() => {
            navigation.navigate('SignUp');
          }}
          activeOpacity={1}
        />

        <View style={[styles.descContainer, {marginTop: 90}]}>
          <View style={styles.descLine} />
          <Text style={styles.desc}>アカウントをお持ちの方</Text>
          <View style={styles.descLine} />
        </View>

        <Button
          title="ログイン"
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonContainer}
          buttonStyle={{backgroundColor: defaultTheme.darkGray}}
          icon={{name: 'login', size: 16, color: 'white'}}
          iconContainerStyle={styles.buttonIcon}
          activeOpacity={1}
        />
        <Text style={styles.termsUseDescription}>
          ログインすることで、
          <Text
            style={styles.termsUserLink}
            onPress={() => navigation.navigate('TermsOfUse')}>
            利用規約
          </Text>
          と
          <Text
            style={styles.termsUserLink}
            onPress={() => navigation.navigate('PrivacyPolicy')}>
            プライバシーポリシー
          </Text>
          に同意したものとみなされます。
        </Text>
      </View>
    </View>
  );
};

const CONTENT_WIDTH = '75%';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  loginContainer: {
    marginTop: '25%',
    width: CONTENT_WIDTH,
  },
  logoContainer: {
    marginTop: '45%',
    alignSelf: 'center',
  },
  descContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
  },
  desc: {
    marginHorizontal: 4,
  },
  buttonTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    position: 'relative',
  },
  buttonIcon: {
    position: 'absolute',
    left: 10,
  },
  termsUseDescription: {
    marginTop: 70,
    color: 'gray',
    lineHeight: 18,
  },
  termsUserLink: {
    textDecorationLine: 'underline',
    color: '#30beff',
  },
});
