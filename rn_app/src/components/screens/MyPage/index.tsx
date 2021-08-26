import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {RootState} from '~/stores';
import {User} from '~/components/utils/User';
import {useRefreshMyData} from '~/hooks/users';

export const MyPage = React.memo(() => {
  const user = useSelector(
    (state: RootState) => state.userReducer.user!,
    shallowEqual,
  );

  const {refreshData} = useRefreshMyData();

  const refresh = async () => {
    await refreshData();
  };

  if (!user) {
    return null;
  }

  return (
    <User
      data={{
        user,
      }}
      refresh={refresh}
    />
  );
});
