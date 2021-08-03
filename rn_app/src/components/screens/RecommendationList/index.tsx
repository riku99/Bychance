import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  RecommendationList as _RecommendationList,
  Recommendation,
  RecommendationItem,
} from 'bychance-components';

export const RecommendationList = React.memo(() => {
  return (
    <View style={styles.container}>
      <_RecommendationList listData={[]} onItemPress={() => {}} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
