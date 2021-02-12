import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {StatusBar, Dimensions} from 'react-native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {unwrapResult} from '@reduxjs/toolkit';

import {RootStackParamList} from '../../screens/Root';
import {
  MyPageStackParamList,
  UserPageScreenGroupParamList,
} from '../../screens/UserPage';
import {SearchUsersStackParamList} from '../../screens/SearchUsers';
import {FlashStackParamList} from '../../screens/Flashes';
import {UserProfile} from '../../components/users/UserProfile';
import {createRoomThunk} from '../../actions/rooms';
import {RootState, AppDispatch, store} from '../../redux/index';
import {Post, selectAllPosts} from '../../redux/post';
import {selectAllFlashes} from '../../redux/flashes';
import {selectRoom} from '../../redux/rooms';
import {X_HEIGHT} from '../../constants/device';
import {alertSomeError} from '../../helpers/error';
import {refreshUserThunk} from '../../actions/users';

type MyPageStackScreenRouteProp = RouteProp<MyPageStackParamList, 'MyProfile'>;

type ProfileStackScreenRouteProp = RouteProp<
  UserPageScreenGroupParamList,
  'UserPage'
>;

type SearchScreenRouteProp = RouteProp<SearchUsersStackParamList, 'Profile'>;

type FlashStackScreenRouteProp = RouteProp<
  FlashStackParamList,
  'AnotherUserProfileFromFlash'
>;

type MyPageNavigationProp = StackNavigationProp<
  MyPageStackParamList,
  'MyProfile'
>;

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

type Props = {
  route:
    | MyPageStackScreenRouteProp
    | ProfileStackScreenRouteProp
    | SearchScreenRouteProp
    | FlashStackScreenRouteProp;
  navigation: RootNavigationProp & MyPageNavigationProp;
};

const {height} = Dimensions.get('window');

export const Container = ({route, navigation}: Props) => {
  // 自分以外のユーザーのプロフィールの場合はrouteにデータが存在する
  const [anotherUser, setAnotherUser] = useState(route && route.params);

  const [refreshing, setRefreshing] = useState(false);

  const referenceId = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });

  const user = useSelector((state: RootState) => {
    if (!anotherUser) {
      return state.userReducer.user!;
    }
  }, shallowEqual);

  const posts = useSelector((state: RootState) => {
    if (!anotherUser) {
      return selectAllPosts(state);
    }
  }, shallowEqual);

  const flashes = useSelector((state: RootState) => {
    return selectAllFlashes(state);
  }, shallowEqual);

  const creatingFlash = useSelector((state: RootState) => {
    if (!anotherUser) {
      return state.otherSettingsReducer.creatingFlash;
    }
  });

  const restUserDataForFlashes = useMemo(() => {
    if (anotherUser) {
      const {flashes, ...restUserData} = anotherUser; // eslint-disable-line
      return restUserData;
    } else {
      const {display, lat, lng, ...restUserData} = user!; // eslint-disable-line
      return {...restUserData, posts: posts!};
    }
  }, [anotherUser, user, posts]);

  useLayoutEffect(() => {
    if (route.name !== 'MyProfile' && anotherUser) {
      navigation.setOptions({headerTitle: anotherUser.name});
    }
  }, [navigation, route.name, anotherUser]);

  // ナビゲーションのジェスチャーが始まった場合の責務を持ったリスナー
  useEffect(() => {
    if (route.name === 'AnotherUserProfileFromFlash') {
      const unsbscribe = navigation.addListener('gestureStart', () => {
        if (height < X_HEIGHT) {
          StatusBar.setHidden(true);
        } else {
          StatusBar.setBarStyle('light-content');
        }
      });

      return unsbscribe;
    }
  }, [navigation, route]);

  // transitionが終了、またジェスチャーの終了で他のスクリーンに遷移しなかった場合の責務を持ったリスナー
  useEffect(() => {
    if (route.name === 'AnotherUserProfileFromFlash') {
      const unsbscribe = navigation.addListener('transitionEnd', (e) => {
        if (!e.data.closing) {
          StatusBar.setBarStyle('default');
          StatusBar.setHidden(false);
        }
      });

      return unsbscribe;
    }
  }, [navigation, route]);

  const pushPost = (post: Post) => {
    navigation.push('Post', post);
  };

  const pushUserEdit = () => {
    navigation.push('UserEdit');
  };

  const pushTakeFlash = () => {
    navigation.push('TakeFlash');
  };

  const dispatch: AppDispatch = useDispatch();

  const pushChatRoom = () => {
    if (anotherUser) {
      dispatch(createRoomThunk(anotherUser))
        .then(unwrapResult)
        .then((payload) => {
          const selectedRoom = selectRoom(store.getState(), payload.id);
          if (selectedRoom) {
            navigation.push('ChatRoomStack', {
              screen: 'ChatRoom',
              params: {
                id: selectedRoom.id,
                partner: selectedRoom.partner,
                timestamp: selectedRoom.timestamp,
                messages: selectedRoom.messages,
                unreadNumber: 0,
                latestMessage: selectedRoom.latestMessage,
              },
            });
          } else {
            alertSomeError();
          }
        });
    }
  };

  const pushFlashes = () => {
    navigation.push('Flashes', {
      screen: 'showFlashes',
      params: {
        allFlashesWithUser: [
          {
            flashes: anotherUser ? anotherUser.flashes : undefined, // 自分のプロフィールからのみflashesプロパティをundefiend
            user: restUserDataForFlashes,
          },
        ],
        index: 0,
      },
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const result = await dispatch(
      refreshUserThunk({
        userId: user && !anotherUser ? user.id : anotherUser!.id,
      }),
    );
    if (refreshUserThunk.fulfilled.match(result)) {
      if (!result.payload.isMyData) {
        setAnotherUser(result.payload.data);
      }
    }
    setRefreshing(false);
  }, [dispatch, user, anotherUser]);

  return (
    <UserProfile
      user={{
        id: anotherUser ? anotherUser.id : user!.id,
        name: anotherUser ? anotherUser.name : user!.name,
        image: anotherUser ? anotherUser.image : user!.image,
        introduce: anotherUser ? anotherUser.introduce : user!.introduce,
      }}
      referenceId={referenceId}
      posts={anotherUser ? anotherUser.posts : posts!}
      flashes={
        anotherUser
          ? {
              entites: anotherUser.flashes.entities,
              isAllAlreadyViewd: anotherUser.flashes.isAllAlreadyViewed,
            }
          : {
              entites: flashes,
              isAllAlreadyViewd: false,
            }
      }
      creatingFlash={creatingFlash}
      refreshing={refreshing}
      onRefresh={onRefresh}
      navigateToPost={pushPost}
      navigateToUserEdit={pushUserEdit}
      navigateToChatRoom={pushChatRoom}
      navigateToTakeFlash={pushTakeFlash}
      navigateToFlashes={pushFlashes}
    />
  );
};
