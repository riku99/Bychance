import React from 'react';
import {ThemeProvider} from 'react-native-elements';
import {defaultTheme} from '~/theme';

type Props = {
  children: JSX.Element;
};

const theme = {
  Badge: {
    badgeStyle: {
      backgroundColor: defaultTheme.primary,
    },
  },
  Text: {
    style: [
      {
        color: '#333333',
      },
    ],
  },
};

export const RNEThemeProvider = ({children}: Props) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
