import React from 'react';

import {MemberImages} from '~/components/utils/MemberImages';

export const GroupMembers = React.memo(({}) => {
  return <MemberImages data={[]} containerStyle={{paddingTop: 10}} />;
});
