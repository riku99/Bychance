import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {default as axios} from 'axios';
import {useApikit} from './apikit';
import {Recommendations} from '~/types/recommendations';
import {useSelector} from 'react-redux';
import {Recommendation} from 'bychance-components';

import {baseUrl} from '~/constants/url';
import {RootState} from '~/stores';

export const useGetRecommendations = () => {
  const {checkKeychain, addBearer, handleApiError} = useApikit();

  const lat = useSelector((state: RootState) => state.userReducer.user!.lat);
  const lng = useSelector((state: RootState) => state.userReducer.user!.lng);

  const [result, setResult] = useState<Recommendation[]>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    if (lat && lng) {
      const credentials = await checkKeychain();

      try {
        const response = await axios.get<Recommendations[]>(
          `${baseUrl}/recommendations?id=${credentials?.id}&lat=${lat}&lng=${lng}`,
          addBearer(credentials?.token),
        );

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
  }, [checkKeychain, addBearer, handleApiError, lat, lng]);

  useEffect(() => {
    setIsLoading(true);
    fetchRecommendations();
    setIsLoading(false);
  }, [fetchRecommendations]);

  return {
    result,
    isLoading,
    fetchRecommendations,
  };
};

export const useHideRecommendation = () => {
  const {checkKeychain, addBearer, handleApiError, toast} = useApikit();
  const [isLoading, setIsLoading] = useState(false);

  const hideRecommendation = useCallback(
    async ({id}: {id: number}) => {
      setIsLoading(true);
      const credentials = await checkKeychain();

      try {
        await axios.post(
          `${baseUrl}/userHideRecommendations?id=${credentials?.id}`,
          {id},
          addBearer(credentials?.token),
        );

        toast?.show('非表示にしました', {type: 'success'});
      } catch (e) {
        handleApiError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [checkKeychain, addBearer, handleApiError, toast],
  );

  return {
    hideRecommendation,
    isLoading,
  };
};
