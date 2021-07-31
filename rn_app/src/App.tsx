import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from './stores/index';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {ToastProvider} from 'react-native-fast-toast';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import Root from './components/Root';
import {normalStyles} from '~/constants/styles';
import {Dimensions} from 'react-native';

const App: () => React.ReactNode = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <Provider store={store}>
        <ToastProvider
          placement="bottom"
          offset={toastOffset}
          successIcon={<MIcon name="done" color="white" size={17} />}
          dangerIcon={<MIcon name="clear" color="white" size={17} />}
          style={{width: bottomToastWidth}}>
          <Root />
        </ToastProvider>
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

const {height, width} = Dimensions.get('screen');

const toastOffset = height * 0.1;
const bottomToastWidth = width * 0.9;

export default App;
