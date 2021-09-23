import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useApikit} from './apikit';
import {Recommendation} from 'bychance-components';

import {useToastLoading} from './appState';
import {useMyLat, useMyLng} from '~/hooks/users';
import {
  getRequestToRecommendations,
  postResuestToUserHideRecommendation,
} from '~/apis/recommendations';

export const useGetRecommendations = () => {
  const {handleApiError} = useApikit();

  const lat = useMyLat();
  const lng = useMyLng();

  const [result, setResult] = useState<Recommendation[]>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    if (lat && lng) {
      try {
        const response = await getRequestToRecommendations({lat, lng});

        const data = response.data.map((d) => {
          const {id, title, text, client, coupon, images} = d;
          const {
            instagram,
            twitter,
            url,
            address,
            image,
            lat: _lat,
            lng: _lng,
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
            lat: _lat,
            lng: _lng,
          };
        });

        setResult(data);
      } catch (e) {
        handleApiError(e);
      }
    } else {
      Alert.alert(
        '位置情報がありません',
        '位置情報を有効にしてください。既に有効にしている場合、マイページのメニューから「位置情報の更新」を行なってみてください。',
      );
    }
  }, [handleApiError, lat, lng]);

  useEffect(() => {
    const _fetch = async () => {
      setIsLoading(true);
      await fetchRecommendations();
      setIsLoading(false);
    };
    _fetch();
  }, [fetchRecommendations]);

  return {
    result,
    isLoading,
    fetchRecommendations,
  };
};

export const useHideRecommendation = () => {
  const {handleApiError, toast} = useApikit();
  const {setToastLoading} = useToastLoading();

  const hideRecommendation = useCallback(
    async ({id}: {id: number}) => {
      setToastLoading(true);

      try {
        await postResuestToUserHideRecommendation({id});

        toast?.show('非表示にしました', {type: 'success'});
      } catch (e) {
        handleApiError(e);
      } finally {
        setToastLoading(false);
      }
    },
    [handleApiError, toast, setToastLoading],
  );

  return {
    hideRecommendation,
  };
};
