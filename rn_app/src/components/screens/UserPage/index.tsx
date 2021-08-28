import React, {useMemo, useLayoutEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';

import {useUserPageInfo, useUserName} from '~/hooks/users';
import {
  UserPageScreenGroupParamList,
  UserPageNavigationProp,
} from '~/navigations/UserPage';
import {User} from '~/components/utils/User';
import {MoreHoriz} from './MoreHoriz';
import {ToastLoading} from '~/components/utils/ToastLoading';
import {MoreHorizModal} from './Modal';

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
  const name = useUserName(route.params.userId);
  const [menuVisible, setMenuVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MoreHoriz
          onPress={() => {
            setMenuVisible(true);
          }}
        />
      ),
      headerTitle: data?.name
        ? data.name
        : name
        ? name
        : 'ユーザーが存在しません',
    });
  }, [data, navigation, route.name, name]);

  const propsData = useMemo(() => {
    if (!data) {
      return;
    }
    const {posts, ...userData} = data; // eslint-disable-line
    return {
      user: userData,
      posts,
    };
  }, [data]);

  const refresh = async () => {
    await mutate();
  };

  if (!propsData) {
    return null;
  }

  return (
    <>
      <User data={propsData} refresh={refresh} />
      {data && (
        <MoreHorizModal
          userId={data.id}
          isVisble={menuVisible}
          closeModal={() => setMenuVisible(false)}
        />
      )}
      {/* {toastLoading && <ToastLoading />} */}
    </>
  );
});
