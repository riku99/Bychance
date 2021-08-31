import React, {useRef} from 'react';
import Swiper from 'react-native-swiper';

import {Screen1} from './Screen1';
import {Screen2} from './Screen2';
import {Screen3} from './Screen3';
import {Screen4} from './Screen4';

export const Intoro = React.memo(() => {
  const swipeRef = useRef<Swiper>(null);

  return (
    <Swiper
      loop={false}
      // scrollEnabled={false}
      showsPagination={false}
      ref={swipeRef}>
      <Screen1 swipreRef={swipeRef} />
      <Screen2 swipreRef={swipeRef} />
      <Screen3 swipreRef={swipeRef} />
      <Screen4 />
    </Swiper>
  );
});
