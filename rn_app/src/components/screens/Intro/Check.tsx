import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {defaultTheme} from '~/theme';

export const Check = () => {
  return <Icon name="done" size={27} color={defaultTheme.pinkGrapefruit} />;
};
