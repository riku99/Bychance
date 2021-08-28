import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

import {useToastLoading} from '~/hooks/appState';

export const ToastLoading = React.memo(() => {
  const {toastLoading} = useToastLoading();

  if (!toastLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={{transform: [{scale: 1.2}]}} color="white" />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
});
