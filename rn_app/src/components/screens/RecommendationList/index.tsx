import React, {useCallback, useEffect, useState} from 'react';
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
} from 'bychance-components/src';
import {useNavigation} from '@react-navigation/native';

import {useGetRecommendations} from '~/hooks/recommendations';
import {RecommendationsNavigationProp} from '~/navigations/Recommendation';

export const RecommendationList = React.memo(() => {
  const {result, isLoading, fetchRecommendations} = useGetRecommendations();
  const [listData, setListData] = useState<Recommendation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<RecommendationsNavigationProp<'List'>>();

  useEffect(() => {
    if (result) {
      setListData(result);
    }
  }, [result]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecommendations();
    setRefreshing(false);
  }, [fetchRecommendations]);

  const onPress = useCallback(
    (r: Recommendation) => {
      navigation.navigate('Detail', {
        ...r,
        setListData: setListData,
      });
    },
    [navigation],
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      {listData && listData.length ? (
        <_RecommendationList
          listData={listData}
          onItemPress={(data) => onPress(data)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          flatListProps={{
            onScroll: () => console.log('scroll'),
          }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.noItemContainer}
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
  noItemContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noText: {
    color: 'gray',
  },
});
