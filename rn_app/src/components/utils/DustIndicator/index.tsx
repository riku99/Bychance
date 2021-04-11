import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import Emoji from 'react-native-emoji';

import {normalStyles} from '~/constants/styles/normal';

export const DustIndicator = () => {
  const translateX = useRef(new Animated.Value(-barWidth)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [translateX]);

  return (
    <View style={styles.container}>
      <View style={styles.indicator}>
        <View style={styles.bar}>
          <Animated.View
            style={[
              styles.bar,
              {backgroundColor: normalStyles.mainColor},
              {transform: [{translateX}]},
            ]}
          />
        </View>
        <Emoji name="wastebasket" />
        <Emoji name="fire" />
        <Emoji name="wave" />
      </View>
    </View>
  );
};

const barWidth = 120;

const styles = StyleSheet.create({
  container: {flex: 1},
  indicator: {
    width: 190,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bar: {
    width: barWidth,
    height: 7,
    backgroundColor: '#e8e8e8',
    borderRadius: 40,
    overflow: 'hidden',
  },
});
