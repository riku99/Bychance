import {useEffect, useState} from 'react';
import {default as axios} from 'axios';
import {useApikit} from './apikit';
import {Recommendations} from '~/types/recommendations';

import {baseUrl} from '~/constants/url';

export const useGetRecommendations = () => {
  const {checkKeychain, addBearer, handleApiError} = useApikit();

  const [result, setResult] = useState<Recommendations[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const _fetch = async () => {
      const credentials = await checkKeychain();

      try {
        const response = await axios.get<Recommendations[]>(
          `${baseUrl}/recommendations?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );

        setResult(response.data);
      } catch (e) {
        handleApiError(e);
      } finally {
        setIsLoading(false);
      }
    };
    _fetch();
  }, [checkKeychain, addBearer, handleApiError]);

  return {
    result,
    isLoading,
  };
};
