import React, {useMemo} from 'react';

import {MemberImages} from '~/components/utils/MemberImages';
import {useGropuData} from '~/hooks/groups';

export const GroupMembers = React.memo(() => {
  const {groupData} = useGropuData();
  const membersData = useMemo(() => {
    if (!groupData?.presence) {
      return [];
    } else {
      return groupData.members.map((g) => ({
        id: g.id,
        imageUrl: g.avatar,
      }));
    }
  }, [groupData]);

  return <MemberImages data={membersData} containerStyle={{paddingTop: 10}} />;
});
