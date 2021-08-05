import React, {useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  RecommendationList as _RecommendationList,
  Recommendation,
} from 'bychance-components';
import {useNavigation} from '@react-navigation/native';

import {useGetRecommendations} from '~/hooks/recommendations';
import {RecommendationsNavigationProp} from '~/navigations/Recommendation';

export const RecommendationList = React.memo(() => {
  const {result, isLoading, fetchRecommendations} = useGetRecommendations();

  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<RecommendationsNavigationProp<'List'>>();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecommendations();
    setRefreshing(false);
  }, [fetchRecommendations]);

  const onPress = useCallback(
    (r: Recommendation) => {
      navigation.navigate('Detail', r);
    },
    [navigation],
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      {result && result.length ? (
        <_RecommendationList
          listData={result}
          onItemPress={(data) => onPress(data)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text style={styles.noText}>この範囲にはありません🐱</Text>
        </ScrollView>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  noText: {
    color: 'gray',
  },
});
