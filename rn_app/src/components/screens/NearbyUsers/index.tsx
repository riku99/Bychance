import React, {useCallback} from 'react';
import {View} from 'react-native';
import {NearbyDataMain} from '~/components/utils/NearbyDataMain';
import {useNearbyUsers} from '~/hooks/nearbyUsers';

export const NearbyUsersScreen = React.memo(() => {
  const {data, isLoading, setRange, getNearbyUsers} = useNearbyUsers();

  const refresh = useCallback(async () => {
    await getNearbyUsers();
  }, [getNearbyUsers]);

  return <NearbyDataMain data={data} isLoading={isLoading} refresh={refresh} />;
});
