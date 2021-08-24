import {useCallback, useEffect, useState} from 'react';
import {useApikit} from './apikit';
import {default as axios} from 'axios';

import {baseUrl} from '~/constants/url';
import {NearbyUsers} from '~/types/nearbyUsers';
import {FlashStamp} from '~/types/flashStamps';
import {GetNearbyUsersReponse} from '~/types/response/nearbyUsers';
import {upsertFlashes} from '~/stores/flashes';
import {useMyId} from './users';
import {upsertUsers} from '~/stores/_users';

export const useNearbyUsers = () => {
  const [data, setData] = useState<GetNearbyUsersReponse>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState(0.1);
  const {checkKeychain, handleApiError, addBearer, dispatch} = useApikit();
  const myId = useMyId();

  const getNearbyUsers = useCallback(async () => {
    const credentials = await checkKeychain();

    try {
      const response = await axios.get<GetNearbyUsersReponse>(
        `${baseUrl}/users/nearby?id=${credentials?.id}&range=${range}`,
        addBearer(credentials?.token),
      );

      setData(response.data);

      let storedFlashesData: any[] = [];
      response.data.forEach((d) => {
        d.flashes.forEach((f) => {
          const viewerViewed = f.viewed.some((v) => v.userId === myId);
          storedFlashesData.push({
            ...f,
            viewerViewed,
          });
        });
      });

      const storedUsersData = response.data.map((d) => ({
        id: d.id,
        name: d.name,
        avatar: d.avatar,
      }));

      console.log(storedFlashesData);
      dispatch(upsertFlashes(storedFlashesData));
      dispatch(upsertUsers(storedUsersData));
    } catch (e) {
      handleApiError(e);
    }
  }, [checkKeychain, addBearer, handleApiError, range, myId, dispatch]);

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
    data,
    isLoading,
    range,
    setRange,
    getNearbyUsers,
  };
};
