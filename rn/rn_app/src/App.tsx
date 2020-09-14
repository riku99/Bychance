import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from './redux/index';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import Root from './screens/Root';

const App: () => React.ReactNode = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <Provider store={store}>
        <Root />
      </Provider>
    </NavigationContainer>
  );
};

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5c94c8',
    text: '#5c94c8',
    background: 'white',
  },
};

export default App;
