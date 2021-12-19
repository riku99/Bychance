import React, {useCallback} from 'react';
import {NearbyDataMain} from '~/components/utils/NearbyDataMain';
import {useNearbyUsers} from '~/hooks/nearbyUsers';
import {MenuAction} from '@react-native-menu/menu';

const menuActions: MenuAction[] = [
  {
    id: '0.3',
    title: 'すぐ近く🕺',
  },
  {
    id: '1.5',
    title: 'ここら辺🪐',
  },
  {
    id: '3.5',
    title: 'ちょい広め💫',
  },
];

export const NearbyUsersScreen = React.memo(() => {
  const {data, isLoading, setRange, getNearbyUsers} = useNearbyUsers();

  const refresh = useCallback(async () => {
    await getNearbyUsers();
  }, [getNearbyUsers]);

  const onMenuAction = useCallback(
    (id: string) => {
      setRange(Number(id));
    },
    [setRange],
  );

  return (
    <NearbyDataMain
      data={data}
      isLoading={isLoading}
      refresh={refresh}
      menuActions={menuActions}
      onMenuAction={onMenuAction}
      menuButtonTitle="検索範囲を変更"
      menuTitle="検索範囲を変更"
    />
  );
});
