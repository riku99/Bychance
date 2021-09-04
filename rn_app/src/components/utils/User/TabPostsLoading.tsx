import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {SkeltonLoadingView} from '~/components/utils/SkeltonLoadingView';

export const TabPostsLoading = () => {
  return (
    <SkeltonLoadingView>
      <View style={styles.container}>
        <View style={styles.item} />
        <View style={styles.item} />
        <View style={styles.item} />
      </View>
    </SkeltonLoadingView>
  );
};

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    width: width / 3.02,
    height: width / 3.02,
  },
});
