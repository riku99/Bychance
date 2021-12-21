import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MenuBar} from '~/components/utils/MenuBar';
import {Button} from 'react-native-elements';
import {defaultTheme} from '~/theme';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '~/navigations/Root';

export const HeaderRightItems = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  return (
    <View style={styles.container}>
      <Button
        icon={{name: 'add-circle-outline', color: defaultTheme.darkGray}}
        buttonStyle={styles.button}
        activeOpacity={1}
        onPress={() => {
          navigation.navigate('CreatePost');
        }}
      />
      <MenuBar />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'transparent',
  },
});
