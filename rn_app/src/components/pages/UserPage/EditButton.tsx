import React from 'react';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import {RootNavigationProp} from '../../../screens/types';
import {normalStyles} from '~/constants/styles/normal';

export const EditButton = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  const onEditButtonPress = () => {
    navigation.push('UserEditStack');
  };
  return (
    <Button
      title="プロフィールを編集"
      buttonStyle={styles.editButton}
      titleStyle={styles.editButtonTitle}
      onPress={onEditButtonPress}
    />
  );
});

const styles = StyleSheet.create({
  editButton: {
    backgroundColor: 'white',
    width: '90%',
    height: 32,
    borderRadius: 30,
    alignSelf: 'center',
    borderColor: normalStyles.mainTextColor,
    borderWidth: 1,
  },
  editButtonTitle: {
    color: normalStyles.mainTextColor,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
