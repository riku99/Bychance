import React, {ComponentProps, useMemo} from 'react';

import {ScrollViewTabScene} from './TabScene';
import {useGropuData} from '~/hooks/groups';
import {MemberImages} from '~/components/utils/MemberImages';

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

  return (
    <ScrollViewTabScene {...props} refresh={customRefresh}>
      <MemberImages data={membersData} containerStyle={{paddingTop: 10}} />
    </ScrollViewTabScene>
  );
});
