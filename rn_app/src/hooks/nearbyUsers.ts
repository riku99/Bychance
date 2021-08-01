import {useCallback} from 'react';
import {useApikit} from './apikit';
import {default as axios} from 'axios';

import {baseUrl} from '~/constants/url';
import {updateChatPartners, selectChatPartnerIds} from '~/stores/chatPartners';
import {NearbyUsers} from '~/types/nearbyUsers';
import {FlashStamp} from '~/types/flashStamps';
import {store} from '~/stores';
import {AnotherUser} from '~/types/anotherUser';
import {setFlashStamps} from '~/stores/flashStamps';
import {setNearbyUsers} from '~/stores/nearbyUsers';

export const useGetNearbyUsers = () => {
  const {checkKeychain, handleApiError, addBearer, dispatch} = useApikit();

  const getNearbyUsers = useCallback(
    async ({
      lat,
      lng,
      range,
    }: {
      lat: number | null;
      lng: number | null;
      range: number;
    }) => {
      const credentials = await checkKeychain();

      try {
        const response = await axios.get<{
          usersData: NearbyUsers;
          flashStampsData: FlashStamp[];
        }>(
          `${baseUrl}/nearbyUsers?id=${credentials?.id}&lat=${lat}&lng=${lng}&range=${range}`,
          addBearer(credentials?.token),
        );

        const {usersData, flashStampsData} = response.data;

        dispatch(setNearbyUsers(usersData));

        const array: {id: string; changes: AnotherUser}[] = [];
        const ids = selectChatPartnerIds(store.getState().chatPartnersReducer);
        ids.forEach((n) => {
          const target = usersData.find((data) => data.id === n);
          if (target) {
            array.push({id: target.id, changes: target});
          }
        });

        dispatch(updateChatPartners(array));
        dispatch(setFlashStamps(flashStampsData));
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, dispatch],
  );

  return {
    getNearbyUsers,
  };
};
