import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RecommendationDetail as _RecommendationDetail} from 'bychance-components';
import {useRoute, RouteProp} from '@react-navigation/native';

import {RecommendationStackParamList} from '~/navigations/Recommendation';

export const RecommendationDetail = React.memo(() => {
  const data = useRoute<RouteProp<RecommendationStackParamList, 'Detail'>>();

  return (
    <View style={styles.container}>
      <_RecommendationDetail data={data.params} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
