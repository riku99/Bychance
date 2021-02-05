import React from 'react';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import {RootNavigationProp} from '../../../screens/types';

export const EditButton = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  const onEditButtonPress = () => {
    navigation.push('UserEdit');
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
    borderColor: '#4ba5fa',
    borderWidth: 1,
  },
  editButtonTitle: {
    color: '#4ba5fa',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
