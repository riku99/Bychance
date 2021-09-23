import {useCallback, useEffect, useState} from 'react';
import {useApikit} from './apikit';

import {upsertFlashes} from '~/stores/flashes';
import {useMyId} from './users';
import {upsertUsers} from '~/stores/_users';
import {getRequestToNearbyUsers} from '~/apis/nearbyUsers';
import {ResponseForGetNearbyUsers} from '~/apis/nearbyUsers/types';

export const useNearbyUsers = () => {
  const [data, setData] = useState<ResponseForGetNearbyUsers>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState(0.1);
  const {handleApiError, dispatch} = useApikit();
  const myId = useMyId();

  const getNearbyUsers = useCallback(async () => {
    try {
      const response = await getRequestToNearbyUsers({range});
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
        block: false,
      }));

      dispatch(upsertFlashes(storedFlashesData));
      dispatch(upsertUsers(storedUsersData));
    } catch (e) {
      handleApiError(e);
    }
  }, [handleApiError, range, myId, dispatch]);

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
