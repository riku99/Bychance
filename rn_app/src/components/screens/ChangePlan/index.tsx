import React, {useLayoutEffect, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {RootNavigationProp} from '~/navigations/Root';
import {useNavigation} from '@react-navigation/native';
import {Text, Button} from 'react-native-elements';
import LottieView from 'lottie-react-native';
import {defaultTheme} from '~/theme';
import {useIap} from '~/hooks/iap';

const Rocket = require('~/assets/lottie/rocket.json');

export const ChangePlan = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'ChangePlan'>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'プランの変更',
    });
  }, [navigation]);

  const {getProducts} = useIap();
  useEffect(() => {
    (async function () {
      if (getProducts) {
        const result = await getProducts();
        console.log('👀 result is ');
        console.log(result);
      }
    })();
  }, [getProducts]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LottieView source={Rocket} autoPlay style={styles.rocket} />
      <Text style={styles.title}>
        プランを変更してさらにアプローチしましょう
      </Text>
      <Text style={styles.price}>￥650/月</Text>
      <Button
        title="ショップアカウントに変更"
        titleStyle={styles.shopButtonTitle}
        containerStyle={styles.shopButtonContainer}
        buttonStyle={styles.shopButton}
        activeOpacity={1}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 14,
  },
  rocket: {
    width: 120,
    height: 120,
    marginTop: 4,
  },
  shopButtonTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  shopButtonContainer: {
    marginTop: 32,
  },
  shopButton: {
    backgroundColor: defaultTheme.primary,
    width: '100%',
  },
  price: {
    marginTop: 22,
    fontWeight: 'bold',
    fontSize: 20,
  },
});
