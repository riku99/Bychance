import React, {useLayoutEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';

import {useUserPageInfo, useUserName, useUserAvatar} from '~/hooks/users';
import {
  UserPageScreenGroupParamList,
  UserPageNavigationProp,
} from '~/navigations/UserPage';
import {User} from '~/components/utils/User';
import {MoreHoriz} from './MoreHoriz';
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
  const {data, mutate, isLoading} = useUserPageInfo(route.params.userId);
  const name = useUserName(route.params.userId) || data?.name || 'f';
  const avatar =
    useUserAvatar({userId: route.params.userId}) || data?.avatar || null;
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

  const refresh = async () => {
    await mutate();
  };

  if (!data) {
    return (
      <User
        id={route.params.userId}
        name={name}
        avatar={avatar}
        refresh={refresh}
        isLoading={isLoading}
      />
    );
  }

  return (
    <>
      <User
        id={route.params.userId}
        name={name}
        avatar={avatar}
        introduce={data.introduce}
        backGroundItem={data.backGroundItem}
        backGroundItemType={data.backGroundItemType}
        snsData={
          data && {
            instagram: data.instagram,
            twitter: data.twitter,
            youtube: data.youtube,
            tiktok: data.tiktok,
          }
        }
        refresh={refresh}
      />
      {data && (
        <MoreHorizModal
          userId={data.id}
          isVisble={menuVisible}
          closeModal={() => setMenuVisible(false)}
        />
      )}
    </>
  );
});
