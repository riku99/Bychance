import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  RecommendationList as _RecommendationList,
  Recommendation,
} from 'bychance-components/src';

import {useGetRecommendations} from '~/hooks/recommendations';

export const RecommendationList = React.memo(() => {
  const {result, isLoading} = useGetRecommendations();

  const listData = useMemo((): Recommendation[] | void => {
    if (result) {
      return result.map((data) => {
        const {id, title, text, client, coupon, images} = data;
        const {
          instagram,
          twitter,
          url,
          address,
          image,
          lat,
          lng,
          name,
        } = client;
        const imaegsData = images.map(({url: _url}) => _url);
        return {
          id,
          name,
          title,
          text,
          coupon,
          images: imaegsData,
          instagram,
          twitter,
          url,
          address,
          avatar: image,
          lat,
          lng,
        };
      });
    }
  }, [result]);

  return (
    <View style={styles.container}>
      {listData && listData?.length ? (
        <_RecommendationList listData={listData} onItemPress={() => {}} />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
