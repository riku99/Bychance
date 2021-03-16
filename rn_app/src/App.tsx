import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from './stores/index';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import Root from './components/Root';
import {normalStyles} from '~/constants/styles/normal';

const App: () => React.ReactNode = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <Provider store={store}>
        <Root />
      </Provider>
    </NavigationContainer>
  );
};

export const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: normalStyles.headerTitleColor,
    primary: normalStyles.headerTitleColor,
    background: 'white',
  },
};

export default App;
