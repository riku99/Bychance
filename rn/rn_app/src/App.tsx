import React from 'react';
import {Provider} from 'react-redux';
import {store} from './redux/index';

import Root from './Root';

const App: () => React.ReactNode = () => {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
};

export default App;
