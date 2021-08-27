import React, {useMemo, useLayoutEffect, useState} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Modal from 'react-native-modal';

import {useUserPageInfo, useUserName} from '~/hooks/users';
import {
  UserPageScreenGroupParamList,
  UserPageNavigationProp,
} from '~/navigations/UserPage';
import {User} from '~/components/utils/User';
import {MoreHoriz} from './MoreHoriz';
import {InstaLikeModal} from '~/components/utils/InstaLikeModal';

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
      <Modal
        isVisible={menuVisible}
        backdropOpacity={0.25}
        style={{justifyContent: 'flex-end', marginBottom: 20}}
        onBackdropPress={() => setMenuVisible(false)}>
        <InstaLikeModal />
      </Modal>
    </>
  );
});
