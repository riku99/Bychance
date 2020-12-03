import {Dimensions} from 'react-native';

import {X_HEIGHT} from './device';

const {height} = Dimensions.get('window');

export const headerStatusBarHeight = () => {
  return X_HEIGHT <= height ? 50 : 20;
};
