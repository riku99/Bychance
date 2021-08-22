import {useCallback, useEffect, useState} from 'react';
import {useApikit} from './apikit';
import {default as axios} from 'axios';

import {baseUrl} from '~/constants/url';
import {NearbyUsers} from '~/types/nearbyUsers';
import {FlashStamp} from '~/types/flashStamps';
import {GetNearbyUsersReponse} from '~/types/response/nearbyUsers';

export const useNearbyUsers = () => {
  const [users, setUsers] = useState<GetNearbyUsersReponse>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState(0.1);
  const {checkKeychain, handleApiError, addBearer} = useApikit();

  const getNearbyUsers = useCallback(async () => {
    const credentials = await checkKeychain();

    try {
      const response = await axios.get<GetNearbyUsersReponse>(
        `${baseUrl}/users/nearby?id=${credentials?.id}&range=${range}`,
        addBearer(credentials?.token),
      );

      setUsers(response.data);
    } catch (e) {
      handleApiError(e);
    }
  }, [checkKeychain, addBearer, handleApiError, range]);

  // リフレッシュ以外の取得。初回レンダリング後とレンジが変化した時
  useEffect(() => {
    const _get = async () => {
      setIsLoading(true);
      await getNearbyUsers();
      setIsLoading(false);
    };
    _get();
  }, [getNearbyUsers]);

  return {
    users,
    isLoading,
    range,
    setRange,
    getNearbyUsers,
  };
};
