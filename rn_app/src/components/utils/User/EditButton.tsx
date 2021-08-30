import React from 'react';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import {RootNavigationProp} from '~/navigations/Root';

export const EditButton = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  const onEditButtonPress = () => {
    navigation.navigate('UserEditStack');
  };
  return (
    <Button
      title="プロフィールを編集"
      buttonStyle={styles.editButton}
      titleStyle={styles.editButtonTitle}
      onPress={onEditButtonPress}
      activeOpacity={1}
    />
  );
});

const styles = StyleSheet.create({
  editButton: {
    backgroundColor: 'white',
    width: '100%',
    height: 32,
    borderRadius: 30,
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  editButtonTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
