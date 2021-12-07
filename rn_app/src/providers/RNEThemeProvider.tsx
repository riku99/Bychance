import React from 'react';
import {ThemeProvider} from 'react-native-elements';
import {defaultTheme} from '~/theme';

type Props = {
  children: JSX.Element;
};

const theme = {
  Badge: {
    badgeStyle: {
      backgroundColor: defaultTheme.pinkGrapefruit,
    },
  },
};

export const RNEThemeProvider = ({children}: Props) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
