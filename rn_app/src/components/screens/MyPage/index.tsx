import React from 'react';

import {User} from '~/components/utils/User';
import {
  useMyId,
  useMyName,
  useRefreshMyData,
  useMyIntroduce,
  useMyBackGroundItem,
  useMyBackGroundItemType,
  useMySNSData,
  useMyAvatar,
} from '~/hooks/users';

export const MyPage = React.memo(() => {
  const id = useMyId();
  const name = useMyName();
  const avatar = useMyAvatar();
  const introduce = useMyIntroduce();
  const backGroundItem = useMyBackGroundItem();
  const backGroundItemType = useMyBackGroundItemType();
  const snsData = useMySNSData();
  const {refreshData} = useRefreshMyData();

  const refresh = async () => {
    await refreshData();
  };

  return (
    <User
      id={id}
      name={name}
      avatar={avatar}
      introduce={introduce}
      backGroundItem={backGroundItem}
      backGroundItemType={backGroundItemType}
      snsData={snsData}
      refresh={refresh}
    />
  );
});
