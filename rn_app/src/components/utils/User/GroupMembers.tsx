// import React, {useMemo, ComponentProps} from 'react';

// import {MemberImages} from '~/components/utils/MemberImages';
// import {useGropuData} from '~/hooks/groups';

// type Props = {
//   userId: string;
//   membersData: ComponentProps<typeof MemberImages>['data'];
// };

// // グループデータはPropsでもらうようにする。リフレッシュが楽なので。
// export const GroupMembers = React.memo(({userId, membersData}: Props) => {
//   return <MemberImages data={membersData} containerStyle={{paddingTop: 10}} />;
// });
