import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {RecommendationList as _RecommendationList} from 'bychance-components';

import {useGetRecommendations} from '~/hooks/recommendations';

export const RecommendationList = React.memo(() => {
  const {result, isLoading, fetchRecommendations} = useGetRecommendations();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecommendations();
    setRefreshing(false);
  }, [fetchRecommendations]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      {result && result.length ? (
        <_RecommendationList
          listData={result}
          onItemPress={() => {}}
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
