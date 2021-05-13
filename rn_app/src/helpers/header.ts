import {Dimensions} from 'react-native';

import {X_HEIGHT} from '~/constants/device';

const {height} = Dimensions.get('window');

export const getHeaderStatusBarHeight = () => {
  return X_HEIGHT <= height ? 50 : 20;
};
