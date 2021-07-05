import React, {ComponentProps} from 'react';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

type Props = ComponentProps<typeof Button>;

export const BackButton = (props: Props) => {
  const navigation = useNavigation();

  const onPress = () => navigation.goBack();

  return <Button {...props} onPress={onPress} activeOpacity={1} />;
};
