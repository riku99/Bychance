import React, {useRef} from 'react';
import Swiper from 'react-native-swiper';

import {Welcom} from './Welcom';
import {AboutLocation} from './AboutLocation';
import {AboutDisplay} from './AboutDisplay';
import {Last} from './Last';
import {AboutNotification} from './AboutNotification';

export const Intoro = React.memo(() => {
  const swipeRef = useRef<Swiper>(null);

  return (
    <Swiper
      loop={false}
      scrollEnabled={false}
      showsPagination={false}
      ref={swipeRef}>
      <Welcom swipreRef={swipeRef} />
      <AboutNotification swipeRef={swipeRef} index={1} />
      <AboutLocation swipeRef={swipeRef} index={2} />
      <AboutDisplay swipeRef={swipeRef} index={3} />
      <Last />
    </Swiper>
  );
});
