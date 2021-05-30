// import React, {useEffect, useState, useRef} from 'react';
// import {Switch, Dimensions, View, StyleSheet, Alert} from 'react-native';
// import {useDispatch} from 'react-redux';
// import {ListItem, Icon} from 'react-native-elements';
// import {Modalize} from 'react-native-modalize';
// import * as Keychain from 'react-native-keychain';

// import {logoutAction} from '../../../apis/session/logout';

// type Props = {
//   isVisble: boolean;
//   userDisplay: boolean;
//   displayMenu: () => void;
//   changeUserDisplay: (display: boolean) => void;
//   talkRoomMessageReceipt: boolean;
// };

// export const Menu = ({
//   isVisble,
//   userDisplay,
//   displayMenu,
//   changeUserDisplay,
//   talkRoomMessageReceipt,
// }: Props) => {
//   const [displaySwitch, setDisplaySwitch] = useState(userDisplay);
//   const [
//     talkRoomMessageReceiptSwitch,
//     setTalkRoomMessageReceiptSwitch,
//   ] = useState(talkRoomMessageReceipt);
//   const dispatch = useDispatch();

//   const list = [
//     {
//       title: '他のユーザーに自分を表示',
//       icon: 'emoji-people',
//       titleStyle: {fontSize: 15, color: '#575757'},
//       onPress: () => {},
//       addComponent: (
//         <Switch
//           value={displaySwitch}
//           style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
//           onValueChange={() => {
//             if (displaySwitch) {
//               setDisplaySwitch(false);
//               changeUserDisplay(false);
//             } else {
//               setDisplaySwitch(true);
//               changeUserDisplay(true);
//             }
//           }}
//         />
//       ),
//     },
//     {
//       title: '他のユーザーからメッセージを受け取る',
//       icon: 'mail-outline',
//       titleStyle: {fontSize: 15, color: '#575757'},
//       addComponent: (
//         <Switch
//           value={talkRoomMessageReceiptSwitch}
//           style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
//         />
//       ),
//     },
//     {
//       title: 'ログアウト',
//       icon: 'logout',
//       titleStyle: {fontSize: 15, color: '#575757'},
//       onPress: () => {
//         Alert.alert('ログアウトしますか?', '', [
//           {
//             text: 'はい',
//             onPress: async () => {
//               await Keychain.resetGenericPassword();
//               dispatch(logoutAction);
//               return;
//             },
//           },
//           {
//             text: 'いいえ',
//             onPress: () => {
//               return;
//             },
//           },
//         ]);
//       },
//     },
//   ];
//   const modalizeRef = useRef<Modalize>(null);
//   useEffect(() => {
//     if (isVisble) {
//       modalizeRef.current?.open();
//     }
//   }, [isVisble]);

//   return (
//     <Modalize
//       ref={modalizeRef}
//       modalHeight={height / 2}
//       onClose={displayMenu}
//       scrollViewProps={{
//         scrollEnabled: false,
//       }}>
//       <View style={styles.inModalContainer}>
//         {list.map((l, i) => {
//           return (
//             <ListItem key={i} onPress={l.onPress}>
//               <Icon name={l.icon} color={l.titleStyle.color} />
//               <ListItem.Content>
//                 <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
//               </ListItem.Content>
//               {l.addComponent}
//             </ListItem>
//           );
//         })}
//       </View>
//     </Modalize>
//   );
// };

// const {height} = Dimensions.get('window');

// const styles = StyleSheet.create({
//   inModalContainer: {
//     width: '97%',
//     alignSelf: 'center',
//     marginTop: 10,
//   },
// });
