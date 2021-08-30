import React from 'react';
import Swiper from 'react-native-swiper';

import {Screen1} from './Screen1';
import {Screen2} from './Screen2';

export const Intoro = React.memo(() => {
  return (
    <Swiper loop={false} scrollEnabled={false} showsPagination={false}>
      <Screen1 />
      <Screen2 />
    </Swiper>
  );
});
