import React, {useMemo, useLayoutEffect} from 'react';
import {RouteProp} from '@react-navigation/native';

import {useUserPageInfo} from '~/hooks/users';
import {
  UserPageScreenGroupParamList,
  UserPageNavigationProp,
} from '~/navigations/UserPage';
import {User} from '~/components/utils/User';

type ProfileStackScreenProp = RouteProp<
  UserPageScreenGroupParamList,
  'UserPage'
>;

type Props = {
  route: ProfileStackScreenProp;
  navigation: UserPageNavigationProp<'UserPage'>;
};
export const UserPage = React.memo(({route, navigation}: Props) => {
  const {data, mutate} = useUserPageInfo(route.params.userId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: data?.name ? data.name : 'ユーザーが存在しません',
    });
  }, [data?.name, navigation, route.name]);

  const propsData = useMemo(() => {
    if (!data) {
      return;
    }
    const {posts, ...userData} = data; // eslint-disable-line
    return {
      user: userData,
      posts,
      flashesData: {entities: []},
    };
  }, [data]);

  const refresh = async () => {
    await mutate();
  };

  if (!propsData) {
    return null;
  }

  return <User data={propsData} refresh={refresh} />;
});
