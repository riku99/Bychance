import React, {ComponentProps, useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';

import {ScrollViewTabScene} from './TabScene';
import {useGropuData} from '~/hooks/groups';
import {MemberImages} from '~/components/utils/MemberImages';
import {UserPageNavigationProp} from '~/navigations/UserPage';

type Props = {} & Omit<ComponentProps<typeof ScrollViewTabScene>, 'children'>;

export const GroupsTabScene = React.memo(({...props}: Props) => {
  const {groupData, fetch} = useGropuData(props.userId);
  const membersData = useMemo(() => {
    if (!groupData?.presence) {
      return [];
    } else {
      return groupData.members
        .map((g) => ({
          id: g.id,
          imageUrl: g.avatar,
        }))
        .filter((r) => r.id !== props.userId);
    }
  }, [groupData, props.userId]);

  const customRefresh = async () => {
    await Promise.all([props.refresh(), fetch()]);
  };

  const navigation = useNavigation<UserPageNavigationProp<any>>();
  const onImagePress = useCallback(
    (userId: string) => {
      navigation.push('UserPage', {
        userId,
      });
    },
    [navigation],
  );

  return (
    <ScrollViewTabScene {...props} refresh={customRefresh}>
      <MemberImages
        data={membersData}
        containerStyle={{paddingTop: 10}}
        skeltonLoading={!groupData}
        onPress={onImagePress}
      />
    </ScrollViewTabScene>
  );
});
