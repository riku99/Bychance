import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';
import {store, persistor} from './stores/index';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {ToastProvider} from 'react-native-fast-toast';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FlashMessage from 'react-native-flash-message';
import {ToastProvider as NewToastProvider} from 'react-native-toast-notifications';
import {PersistGate} from 'redux-persist/es/integration/react';
import {RNEThemeProvider} from '~/providers/RNEThemeProvider';
import Root from './components/Root';
import {Dimensions} from 'react-native';
import {ToastLoading} from '~/components/utils/ToastLoading';
import {defaultTheme} from '~/theme';
// import {IAPProvider} from '~/providers/IAPProvider';

const App: () => React.ReactNode = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NewToastProvider placement="top" style={{width: toastWidth}}>
            <ToastProvider
              placement="bottom"
              offset={toastOffset}
              successIcon={<MIcon name="done" color="white" size={17} />}
              dangerIcon={<MIcon name="clear" color="white" size={17} />}
              style={{width: toastWidth}}>
              <RNEThemeProvider>
                <Root />
              </RNEThemeProvider>
              <FlashMessage position="top" />
              <ToastLoading />
            </ToastProvider>
          </NewToastProvider>
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
};

export const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: defaultTheme.darkGray,
    primary: defaultTheme.darkGray,
    background: 'white',
  },
};

const {height, width} = Dimensions.get('screen');

const toastOffset = height * 0.1;
const toastWidth = width * 0.9;

export default App;
