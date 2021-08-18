import React, {useMemo} from 'react';
import {RouteProp} from '@react-navigation/native';

import {useUserPageInfo, useMyId} from '~/hooks/users';
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
  const id = useMyId();
  const {data} = useUserPageInfo(id);

  const propsData = useMemo(() => {
    if (!data) {
      return;
    }
    const {videoEditDescription, ...restData} = data; // eslint-disable-line
    const {posts, flashesData, ...userData} = restData; // eslint-disable-line
    return {
      user: userData,
      posts,
      flashesData,
    };
  }, [data]);

  if (!propsData) {
    return null;
  }

  return <User data={propsData} />;
});
