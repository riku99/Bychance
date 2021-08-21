import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {RootState} from '~/stores';
import {User} from '~/components/utils/User';
import {getAllPosts} from '~/stores/posts';
import {getAllFlashes} from '~/stores/flashes';
import {useRefreshMyData} from '~/hooks/users';

export const MyPage = React.memo(() => {
  const user = useSelector(
    (state: RootState) => state.userReducer.user!,
    shallowEqual,
  );

  const posts = useSelector(
    (state: RootState) => getAllPosts(state),
    shallowEqual,
  );

  const flashes = useSelector(
    (state: RootState) => getAllFlashes(state),
    shallowEqual,
  );

  const {refreshData} = useRefreshMyData();

  const refresh = async () => {
    await refreshData();
  };

  if (!user || !posts || !flashes) {
    return null;
  }

  return (
    <User
      data={{
        user,
        posts,
        flashesData: {
          entities: flashes,
        },
      }}
      refresh={refresh}
    />
  );
});
