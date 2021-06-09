import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {normalStyles} from '~/constants/styles';

export const SkeltonLoadingView = React.memo(() => {
  return (
    <SkeletonPlaceholder
      backgroundColor={normalStyles.imageBackGroundColor}
      speed={1000}
      highlightColor={'#fcfcfc'}>
      <View style={styles.content} />
    </SkeletonPlaceholder>
  );
});

const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
  },
});
