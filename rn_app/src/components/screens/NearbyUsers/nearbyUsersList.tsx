import React, {useContext} from 'react';
import {StyleSheet, View, Text, RefreshControl} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ListItem} from 'react-native-elements';

import {Avatar} from './Avatar';
import {TabViewContext} from './index';

export const List = React.memo(() => {
  const {users, onAvatarPress, onListItemPress} = useContext(TabViewContext);

  // const caluculateDuration = useCallback((n: number) => {
  //   return n * 5;
  // }, []);

  return (
    <View style={styles.container}>
      {users.length ? (
        <>
          <ScrollView
            scrollEventThrottle={16}
            // contentInset={{top: SEARCH_TAB_HEIGHT}}
            // contentOffset={{y: -SEARCH_TAB_HEIGHT, x: 0}}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={refreshing}
            //     onRefresh={() => onRefresh(range)}
            //   />
            // }
            // onScroll={Animated.event(
            //   [{nativeEvent: {contentOffset: {y: scrollY}}}],
            //   {
            //     useNativeDriver: false,
            //     listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            //       if (e.nativeEvent.contentOffset.y > SEARCH_TAB_HEIGHT) {
            //         scrollY.setValue(SEARCH_TAB_HEIGHT);
            //       }
            //     },
            //   },
            // )}
            // onScrollEndDrag={(e) => {
            //   if (e.nativeEvent.contentOffset.y > offsetY.current) {
            //     offsetY.current = e.nativeEvent.contentOffset.y;
            //   } else if (e.nativeEvent.contentOffset.y < offsetY.current) {
            //     Animated.timing(scrollY, {
            //       toValue: 0,
            //       duration: caluculateDuration(
            //         offsetY.current > 80 ? 80 : offsetY.current,
            //       ),
            //       useNativeDriver: false,
            //     }).start();
            //     offsetY.current = e.nativeEvent.contentOffset.y;
            //   }
            // }}
          >
            <View>
              {users.map((u) => (
                <ListItem
                  containerStyle={{height: 72}}
                  key={u.id}
                  onPress={() => {
                    if (onListItemPress) {
                      onListItemPress(u);
                    }
                  }}>
                  <Avatar user={u} onAvatarPress={onAvatarPress} />
                  <ListItem.Content>
                    <ListItem.Title style={{fontWeight: '500', fontSize: 15}}>
                      {u.name}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.subtitle}>
                      {u.statusMessage}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={styles.noUser}>
          <Text style={styles.noUserText}>この範囲にユーザーはいません</Text>
        </View>
      )}

      {/* <View style={styles.pcikerContainer}>
        <RangeSelectButton setRange={setRange} />
      </View> */}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 3,
  },
  noUser: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noUserText: {
    fontSize: 18,
    color: '#999999',
  },
  pcikerContainer: {
    position: 'absolute',
    bottom: '3%',
    right: '7%',
    width: 130,
    height: 40,
  },
});

// type Props = {
//   users: AnotherUser[];
//   range: number;
//   setRange: Dispatch<SetStateAction<number>>;
//   position: {lat: number | null; lng: number | null};
//   onListItemPress: (user: AnotherUser) => void;
//   onAvatarPress: ({
//     isAllAlreadyViewed,
//     userId,
//     flashesData,
//   }:
//     | {
//         isAllAlreadyViewed: true;
//         userId: string;
//         flashesData: FlashesData;
//       }
//     | {
//         isAllAlreadyViewed: false;
//         userId: string;
//         flashesData: undefined;
//       }) => void;
// };

// export const List = React.memo(
//   ({
//     users,
//     range,
//     setRange,
//     position,
//     onListItemPress,
//     onAvatarPress,
//   }: Props) => {
//     const [filteredUsers, setFilteredUsers] = useState(users);
//     const [keyword, setKeyword] = useState('');

//     const scrollY = useRef(new Animated.Value(0)).current;
//     const offsetY = useRef(0);

//     const caluculateDuration = useCallback((n: number) => {
//       return n * 5;
//     }, []);

//     const transformY = scrollY.interpolate({
//       inputRange: [0, SEARCH_TAB_HEIGHT],
//       outputRange: [0, -SEARCH_TAB_HEIGHT],
//       extrapolate: 'clamp',
//     });

//     useEffect(() => {
//       if (keyword === '') {
//         setFilteredUsers(users);
//       } else {
//         const matchedUsers = users.filter((u) => {
//           return (
//             u.name.toLowerCase().includes(keyword.toLowerCase()) ||
//             (u.introduce &&
//               u.introduce.toLowerCase().includes(keyword.toLowerCase())) ||
//             (u.statusMessage &&
//               u.statusMessage.toLowerCase().includes(keyword.toLowerCase()))
//           );
//         });
//         setFilteredUsers(matchedUsers);
//       }
//     }, [keyword, users]);

//     const dispatch: AppDispatch = useDispatch();

//     const [refreshing, setRefreshing] = useState(false);
//     const onRefresh = useCallback(
//       async (range: number) => {
//         setRefreshing(true);
//         await dispatch(
//           getNearbyUsersThunk({lat: position.lat, lng: position.lng, range}),
//         );
//         setRefreshing(false);
//       },
//       [dispatch, position.lat, position.lng],
//     );

//     return (
//       <View style={styles.container}>
//         {/* <Animated.View
//           style={{
//             ...styles.displayOptionsContainer,
//             transform: [{translateY: transformY}],
//           }}>
//           <SearchBar
//             placeholder="キーワードを検索"
//             inputContainerStyle={styles.searchInputContainer}
//             containerStyle={styles.searchContainer}
//             lightTheme={true}
//             round={true}
//             value={keyword}
//             onChangeText={(text) => {
//               setKeyword(text);
//             }}
//           />
//         </Animated.View> */}
//         {filteredUsers.length ? (
//           <>
//             <ScrollView
//               // contentInset={{top: SEARCH_TAB_HEIGHT}}
//               // contentOffset={{y: -SEARCH_TAB_HEIGHT, x: 0}}
//               scrollEventThrottle={16}
//               refreshControl={
//                 <RefreshControl
//                   refreshing={refreshing}
//                   onRefresh={() => onRefresh(range)}
//                 />
//               }
//               onScroll={Animated.event(
//                 [{nativeEvent: {contentOffset: {y: scrollY}}}],
//                 {
//                   useNativeDriver: false,
//                   listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//                     if (e.nativeEvent.contentOffset.y > SEARCH_TAB_HEIGHT) {
//                       scrollY.setValue(SEARCH_TAB_HEIGHT);
//                     }
//                   },
//                 },
//               )}
//               onScrollEndDrag={(e) => {
//                 if (e.nativeEvent.contentOffset.y > offsetY.current) {
//                   offsetY.current = e.nativeEvent.contentOffset.y;
//                 } else if (e.nativeEvent.contentOffset.y < offsetY.current) {
//                   Animated.timing(scrollY, {
//                     toValue: 0,
//                     duration: caluculateDuration(
//                       offsetY.current > 80 ? 80 : offsetY.current,
//                     ),
//                     useNativeDriver: false,
//                   }).start();
//                   offsetY.current = e.nativeEvent.contentOffset.y;
//                 }
//               }}>
//               <View>
//                 {filteredUsers.map((u) => (
//                   <ListItem
//                     containerStyle={{height: 75}}
//                     key={u.id}
//                     onPress={() => {
//                       onListItemPress(u);
//                     }}>
//                     <Avatar user={u} onAvatarPress={onAvatarPress} />
//                     <ListItem.Content>
//                       <ListItem.Title style={{fontWeight: '500', fontSize: 17}}>
//                         {u.name}
//                       </ListItem.Title>
//                       <ListItem.Subtitle style={styles.subtitle}>
//                         {u.statusMessage}
//                       </ListItem.Subtitle>
//                     </ListItem.Content>
//                   </ListItem>
//                 ))}
//               </View>
//             </ScrollView>
//           </>
//         ) : (
//           <View style={styles.noUser}>
//             <Text style={styles.noUserText}>この範囲にユーザーはいません</Text>
//           </View>
//         )}

//         <View style={styles.pcikerContainer}>
//           <RangeSelectButton setRange={setRange} />
//         </View>
//       </View>
//     );
//   },
// );
