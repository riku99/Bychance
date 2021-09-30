import {ViewStyle} from 'react-native';

export const normalStyles = {
  mainColor: '#ff6e7f',
  imageBackGroundColor: '#e8e8e8',
  headerTitleColor: '#545454',
};

export const mainButtonGradientConfig: {
  colors: string[];
  start: {x: number; y: number};
  end: {x: number; y: number};
  baseStyle: ViewStyle;
} = {
  colors: [normalStyles.mainColor, '#ff9c96'],
  start: {x: 0.0, y: 1.0},
  end: {x: 1.0, y: 1.0},
  baseStyle: {alignItems: 'center', justifyContent: 'center'},
};
