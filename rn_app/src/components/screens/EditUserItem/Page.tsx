// import React from 'react';
// import {useDispatch} from 'react-redux';
// import {useNavigation} from '@react-navigation/native';

// import {EditPage} from './EditPage';
// import {
//   UserEditNavigationProp,
//   UserEditRouteProp,
// } from '../../../navigations/types';
// import {saveEditData} from '../../../stores/user';

// type Props = {
//   route: UserEditRouteProp<'IntroduceEdit' | 'NameEdit' | 'StatusMessageEdit'>;
// };

// export const EditUserItemPage = ({route}: Props) => {
//   const dispatch = useDispatch();
//   const userEditNavigation = useNavigation<
//     UserEditNavigationProp<'IntroduceEdit' | 'NameEdit' | 'StatusMessageEdit'>
//   >();

//   return (
//     <EditPage
//       name={route.params.type === 'name' ? route.params.name : undefined}
//       introduce={
//         route.params.type === 'introduce' ? route.params.introduce : undefined
//       }
//       statusMessage={
//         route.params.type === 'statusMessage'
//           ? route.params.statusMessage
//           : undefined
//       }
//       saveEditData={({
//         name,
//         introduce,
//         statusMessage,
//       }: {
//         name?: string;
//         introduce?: string;
//         statusMessage?: string;
//       }) => {
//         dispatch(saveEditData({name, introduce, statusMessage}));
//         userEditNavigation.goBack();
//       }}
//       navigation={userEditNavigation}
//     />
//   );
// };
