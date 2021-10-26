import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import Swiper from 'react-native-swiper';

import {Welcom} from './Welcom';
import {AboutLocation} from './AboutLocation';
import {First, Second} from './AboutDisplay';
import {Last} from './Last';
import {AboutNotification} from './AboutNotification';
import {AboutPrivateZone} from './AboutPrivateZone';

export const Intro = React.memo(() => {
  const swipeRef = useRef<Swiper>(null);

  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        scrollEnabled={false}
        showsPagination={false}
        ref={swipeRef}>
        <Welcom swipreRef={swipeRef} />
        <AboutNotification swipeRef={swipeRef} index={1} />
        <AboutLocation swipeRef={swipeRef} index={2} />
        <First swipeRef={swipeRef} index={3} />
        <Second swipeRef={swipeRef} index={4} />
        <AboutPrivateZone swipeRef={swipeRef} index={5} />
        <Last />
      </Swiper>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
