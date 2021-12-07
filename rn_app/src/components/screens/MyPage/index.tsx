import React from 'react';
import {User} from '~/components/utils/User';
import {
  useMyId,
  useMyName,
  useRefreshMyData,
  useMyIntroduce,
  useMyBackGroundItem,
  useMySNSData,
  useMyAvatar,
} from '~/hooks/users';
import {DescriptionModal} from './DescriptionModal';

export const MyPage = React.memo(() => {
  const id = useMyId();
  const name = useMyName();
  const avatar = useMyAvatar();
  const introduce = useMyIntroduce();
  const backGroundItem = useMyBackGroundItem();
  const snsData = useMySNSData();
  const {refreshData} = useRefreshMyData();

  const refresh = async () => {
    await refreshData();
  };

  return (
    <>
      <User
        id={id}
        name={name}
        avatar={avatar}
        introduce={introduce}
        backGroundItem={backGroundItem}
        snsData={snsData}
        refresh={refresh}
      />
      <DescriptionModal />
    </>
  );
});
