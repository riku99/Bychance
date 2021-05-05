// import React, {useMemo} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';
// import {useSelector} from 'react-redux';

// import {RootState} from '../../../stores/index';
// import {User} from '../../../stores/user';
// import {normalStyles} from '../../../constants/styles/normal';

// type Props = {
//   user: Pick<User, 'name' | 'introduce' | 'avatar'>;
//   avatarOuterType: 'gradation' | 'silver' | 'none';
//   setUserAvatarAndNameContainerHeight: React.Dispatch<
//     React.SetStateAction<number>
//   >;
//   expandedIntroduceContainer: boolean;
//   setAvatarToIntroduceHeight: React.Dispatch<React.SetStateAction<number>>;
// };

// export const Profile = React.memo(
//   ({
//     user,
//     avatarOuterType,
//     setUserAvatarAndNameContainerHeight,
//     expandedIntroduceContainer,
//     setAvatarToIntroduceHeight,
//   }: Props) => {
//     // const {nameContainerTop, editContainerTop} = useMemo(() => {
//     //   switch (avatarOuterType) {
//     //     case 'none':
//     //       return {nameContainerTop: 20, editContainerTop: 29};
//     //     default:
//     //       return {nameContainerTop: 24, editContainerTop: 24};
//     //   }
//     // }, [avatarOuterType]);

//     const lineNumber = useMemo(
//       () =>
//         user.introduce?.split(/\n|\r\n|\r/).length
//           ? user.introduce?.split(/\n|\r\n|\r/).length
//           : 0,
//       [user.introduce],
//     );

//     const showExpandButton = useMemo(() => {
//       if (lineNumber * oneIntroduceTextLineHeght > introduceMaxAndMinHight) {
//         return true;
//       } else {
//         return false;
//       }
//     }, [lineNumber]);

//     const creatingPost = useSelector(
//       (state: RootState) => state.otherSettingsReducer.creatingPost,
//     );

//     return (
//       <View style={styles.contaienr}>
//         <View
//           onLayout={(e) =>
//             setAvatarToIntroduceHeight(e.nativeEvent.layout.height)
//           }>
//           <View
//             onLayout={(e) =>
//               setUserAvatarAndNameContainerHeight(e.nativeEvent.layout.height)
//             }>
//             <View style={styles.avatarContainer} />
//             {/* <View style={[styles.nameContainer, {marginTop: nameContainerTop}]}>
//               <Text style={styles.name}>{user.name}</Text>
//             </View> */}
//           </View>
//           <View style={[styles.editContainer]} />
//           <View
//             style={[
//               styles.introduceContainer,
//               {
//                 maxHeight: expandedIntroduceContainer
//                   ? undefined
//                   : introduceMaxAndMinHight,
//               },
//             ]}>
//             <Text style={styles.introduce}>{user.introduce}</Text>
//           </View>
//         </View>
//         {showExpandButton ? (
//           <View
//             style={{
//               height: expandIntroduceButtonContainerHeight,
//             }}
//           />
//         ) : undefined}
//         {creatingPost && (
//           <View style={styles.creatingPost}>
//             <ActivityIndicator />
//             <Text style={{fontWeight: 'bold', color: '#999999'}}>
//               投稿中です
//             </Text>
//           </View>
//         )}
//       </View>
//     );
//   },
// );
// const {height} = Dimensions.get('window');

// export const userAvatarTop = 24;
// export const userAvatarHeight = 85;

// export const introduceMaxAndMinHight = height / 7;
// export const oneIntroduceTextLineHeght = 19.7;

// export const expandIntroduceButtonContainerHeight = 46;

// const styles = StyleSheet.create({
//   contaienr: {
//     flex: 1,
//   },
//   avatarContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: userAvatarTop,
//     height: userAvatarHeight,
//   },
//   nameContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   name: {
//     fontSize: 16,
//     marginTop: 3,
//     color: normalStyles.mainTextColor,
//     fontWeight: '500',
//   },
//   editContainer: {
//     alignItems: 'center',
//     height: 40,
//   },
//   introduceContainer: {
//     minHeight: introduceMaxAndMinHight,
//     paddingHorizontal: 25,
//     marginTop: '5%',
//   },
//   introduce: {
//     color: normalStyles.mainTextColor,
//     lineHeight: oneIntroduceTextLineHeght,
//   },
//   creatingPost: {
//     flexDirection: 'row',
//     alignSelf: 'center',
//     marginTop: 15,
//     width: 120,
//     justifyContent: 'space-evenly',
//     alignItems: 'center',
//   },
// });
