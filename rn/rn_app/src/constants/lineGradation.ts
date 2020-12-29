import {ViewStyle} from 'react-native';

export const flashesGradation: {
  colors: string[];
  start: {x: number; y: number};
  end: {x: number; y: number};
  baseStyle: ViewStyle;
} = {
  colors: ['#00FFFF', '#17C8FF', '#329BFF', '#4C64FF', '#6536FF', '#8000FF'],
  start: {x: 0.0, y: 1.0},
  end: {x: 1.0, y: 1.0},
  baseStyle: {alignItems: 'center', justifyContent: 'center'},
};

// userProfileOuterGradientコンポーネント作る！
