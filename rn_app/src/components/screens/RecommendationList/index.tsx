import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  RecommendationList as _RecommendationList,
  Recommendation,
} from 'bychance-components/src';
import {useNavigation} from '@react-navigation/native';
import {SearchBar} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useGetRecommendations} from '~/hooks/recommendations';
import {RecommendationsNavigationProp} from '~/navigations/Recommendation';
import {BOTTOM_TAB_HEIGHT} from '~/constants/bottomTabBar';

export const RecommendationList = React.memo(() => {
  const {result, isLoading, fetchRecommendations} = useGetRecommendations();
  const [listData, setListData] = useState<Recommendation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<RecommendationsNavigationProp<'List'>>();
  const [tag, setTag] = useState('');

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

  const {bottom, top} = useSafeAreaInsets();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <SearchBar
          placeholder="#タグを検索"
          inputContainerStyle={styles.searchInputContainer}
          containerStyle={styles.searchContainer}
          platform="default"
          value={tag}
          onChangeText={(t) => setTag(t)}
        />
        {listData && listData.length ? (
          <View
            style={{
              height:
                height - SEARCH_TAB_HEIGHT - BOTTOM_TAB_HEIGHT - top - bottom,
            }}>
            <_RecommendationList
              listData={listData}
              onItemPress={(data) => onPress(data)}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              flatListProps={{}}
            />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.noItemContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <Text style={styles.noText}>この範囲にはありません🐱</Text>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
});

const SEARCH_TAB_HEIGHT = 55;
const {height} = Dimensions.get('screen');

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
  searchContainer: {
    backgroundColor: 'white',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    height: SEARCH_TAB_HEIGHT,
  },
  searchInputContainer: {
    width: '90%',
    height: 30,
    backgroundColor: '#f2f2f2',
    alignSelf: 'center',
  },
});
