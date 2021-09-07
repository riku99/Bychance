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

const l = [
  {
    address: '千葉県習志野市秋津１丁目２−２',
    avatar:
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/rClientProfileImage/ZG093v7uqIX2KKJjvv0bwzpG2iUgIkkL%2BWrY1wfCwwU%3D.webp',
    coupon: true,
    id: 3,
    images: [
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/O3fDF326Nbc2jeiexs6EarjN4bed5NAMqFIgH1tvOgI%3D.webp',
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/yEZsSAEQKfZzJoSm7DeZg6FR7OurK90SKmy3fJsHjrU%3D.webp',
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/9pku03LwgJfi0hN7IxcYCJM1okytFF4VwwBQaVHZtmE%3D.webp',
    ],
    instagram: 'rik0999',
    lat: 35.67403513326948,
    lng: 140.012357054417,
    name: 'Kuroカフェ',
    text:
      '最近できた美味しいラテが自慢のカフェです!️最近暑いのでアイスで飲んでいかれる方が多いです☺️当店のオススメは抹茶ラテのアイスとオリジナルドーナッツの組み合わせです!!ぜひ立ち寄ってみてください😊この画面を表示していただいた場合お一人様100円引きさせて頂きます。なお、お1人様1回限りとさせていただきます。',
    title: 'オシャレなカフェでまったりしませんか??',
    twitter: null,
    url: 'https:',
  },
  {
    address: '千葉県習志野市秋津１丁目２−２',
    avatar:
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/rClientProfileImage/ZG093v7uqIX2KKJjvv0bwzpG2iUgIkkL%2BWrY1wfCwwU%3D.webp',
    coupon: true,
    id: 4,
    images: [
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/O3fDF326Nbc2jeiexs6EarjN4bed5NAMqFIgH1tvOgI%3D.webp',
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/yEZsSAEQKfZzJoSm7DeZg6FR7OurK90SKmy3fJsHjrU%3D.webp',
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/9pku03LwgJfi0hN7IxcYCJM1okytFF4VwwBQaVHZtmE%3D.webp',
    ],
    instagram: 'rik0999',
    lat: 35.67403513326948,
    lng: 140.012357054417,
    name: 'Kuroカフェ',
    text:
      '最近できた美味しいラテが自慢のカフェです!️最近暑いのでアイスで飲んでいかれる方が多いです☺️当店のオススメは抹茶ラテのアイスとオリジナルドーナッツの組み合わせです!!ぜひ立ち寄ってみてください😊この画面を表示していただいた場合お一人様100円引きさせて頂きます。なお、お1人様1回限りとさせていただきます。',
    title: 'オシャレなカフェでまったりしませんか??',
    twitter: null,
    url: 'https:',
  },
  {
    address: '千葉県習志野市秋津１丁目２−２',
    avatar:
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/rClientProfileImage/ZG093v7uqIX2KKJjvv0bwzpG2iUgIkkL%2BWrY1wfCwwU%3D.webp',
    coupon: true,
    id: 5,
    images: [
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/O3fDF326Nbc2jeiexs6EarjN4bed5NAMqFIgH1tvOgI%3D.webp',
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/yEZsSAEQKfZzJoSm7DeZg6FR7OurK90SKmy3fJsHjrU%3D.webp',
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/9pku03LwgJfi0hN7IxcYCJM1okytFF4VwwBQaVHZtmE%3D.webp',
    ],
    instagram: 'rik0999',
    lat: 35.67403513326948,
    lng: 140.012357054417,
    name: 'Kuroカフェ',
    text:
      '最近できた美味しいラテが自慢のカフェです!️最近暑いのでアイスで飲んでいかれる方が多いです☺️当店のオススメは抹茶ラテのアイスとオリジナルドーナッツの組み合わせです!!ぜひ立ち寄ってみてください😊この画面を表示していただいた場合お一人様100円引きさせて頂きます。なお、お1人様1回限りとさせていただきます。',
    title: 'オシャレなカフェでまったりしませんか??',
    twitter: null,
    url: 'https:',
  },
  {
    address: '千葉県習志野市秋津１丁目２−２',
    avatar:
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/rClientProfileImage/ZG093v7uqIX2KKJjvv0bwzpG2iUgIkkL%2BWrY1wfCwwU%3D.webp',
    coupon: true,
    id: 6,
    images: [
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/O3fDF326Nbc2jeiexs6EarjN4bed5NAMqFIgH1tvOgI%3D.webp',
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/yEZsSAEQKfZzJoSm7DeZg6FR7OurK90SKmy3fJsHjrU%3D.webp',
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/9pku03LwgJfi0hN7IxcYCJM1okytFF4VwwBQaVHZtmE%3D.webp',
    ],
    instagram: 'rik0999',
    lat: 35.67403513326948,
    lng: 140.012357054417,
    name: 'Kuroカフェ',
    text:
      '最近できた美味しいラテが自慢のカフェです!️最近暑いのでアイスで飲んでいかれる方が多いです☺️当店のオススメは抹茶ラテのアイスとオリジナルドーナッツの組み合わせです!!ぜひ立ち寄ってみてください😊この画面を表示していただいた場合お一人様100円引きさせて頂きます。なお、お1人様1回限りとさせていただきます。',
    title: 'オシャレなカフェでまったりしませんか??',
    twitter: null,
    url: 'https:',
  },
  {
    address: '千葉県習志野市秋津１丁目２−２',
    avatar:
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/rClientProfileImage/ZG093v7uqIX2KKJjvv0bwzpG2iUgIkkL%2BWrY1wfCwwU%3D.webp',
    coupon: true,
    id: 7,
    images: [
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/O3fDF326Nbc2jeiexs6EarjN4bed5NAMqFIgH1tvOgI%3D.webp',
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/yEZsSAEQKfZzJoSm7DeZg6FR7OurK90SKmy3fJsHjrU%3D.webp',
      'https://d3kod1lyh2qk33.cloudfront.net/23140a26-713b-4c97-9d0e-8ab98927fec2/recommendation/9pku03LwgJfi0hN7IxcYCJM1okytFF4VwwBQaVHZtmE%3D.webp',
    ],
    instagram: 'rik0999',
    lat: 35.67403513326948,
    lng: 140.012357054417,
    name: 'Kuroカフェ',
    text:
      '最近できた美味しいラテが自慢のカフェです!️最近暑いのでアイスで飲んでいかれる方が多いです☺️当店のオススメは抹茶ラテのアイスとオリジナルドーナッツの組み合わせです!!ぜひ立ち寄ってみてください😊この画面を表示していただいた場合お一人様100円引きさせて頂きます。なお、お1人様1回限りとさせていただきます。',
    title: 'オシャレなカフェでまったりしませんか??',
    twitter: null,
    url: 'https:',
  },
];

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
              listData={l}
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
