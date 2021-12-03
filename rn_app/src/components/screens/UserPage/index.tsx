import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Alert} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useUserPageInfo, useUserName, useUserAvatar} from '~/hooks/users';
import {
  UserPageScreenGroupParamList,
  UserPageNavigationProp,
} from '~/navigations/UserPage';
import {User} from '~/components/utils/User';
import {MoreHoriz} from './MoreHoriz';
import {MoreHorizModal} from './Modal';
import {useGroupMemberWhoBlcokTargetUserExists} from '~/hooks/groups';
import {getThumbnailUrl} from '~/helpers/video';

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
  const name = useUserName(route.params.userId) || data?.name || '';
  const avatar =
    useUserAvatar({userId: route.params.userId}) || data?.avatar || null;
  const [menuVisible, setMenuVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {shadowColor: 'transparent'},
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

  const {
    result: groupMemberWhoBlockThisUserExists,
  } = useGroupMemberWhoBlcokTargetUserExists({targetUserId: data?.id});
  useEffect(() => {
    if (groupMemberWhoBlockThisUserExists) {
      Alert.alert(
        'メンバーがブロックしています',
        'このユーザーをあなたの現在のグループのメンバーがブロックしています。やりとりには注意してください',
      );
    }
  }, [groupMemberWhoBlockThisUserExists]);

  useEffect(() => {
    if (data?.flashes.length) {
      const item = data.flashes[0];
      const uri =
        item.sourceType === 'image'
          ? item.source
          : getThumbnailUrl(item.source);
      FastImage.preload([
        {
          uri,
        },
      ]);
    }
  }, [data]);

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
