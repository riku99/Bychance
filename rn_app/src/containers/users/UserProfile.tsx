import React, {useEffect, useLayoutEffect, useMemo} from 'react';
import {StatusBar, Dimensions} from 'react-native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {unwrapResult} from '@reduxjs/toolkit';

import {RootStackParamList} from '../../screens/Root';
import {
  MyPageStackParamList,
  ProfileScreensGroupParamList,
} from '../../screens/Profile';
import {SearchStackParamList} from '../../screens/Search';
import {FlashStackParamList} from '../../screens/Flash';
import {ChatRoomStackParamParamList} from '../../screens/ChatRoom';
import {UserProfile} from '../../components/users/UserProfile';
import {createRoomThunk} from '../../actions/rooms';
import {RootState, AppDispatch} from '../../redux/index';
import {Post, selectAllPosts} from '../../redux/post';
import {selectAllFlashes} from '../../redux/flashes';
import {selectRoom} from '../../redux/rooms';
import {X_HEIGHT} from '../../constants/device';
import {alertSomeError} from '../../helpers/error';

type MyPageStackScreenRouteProp = RouteProp<MyPageStackParamList, 'MyProfile'>;

type ProfileStackScreenRouteProp = RouteProp<
  ProfileScreensGroupParamList,
  'Profile'
>;

type SearchScreenRouteProp = RouteProp<
  SearchStackParamList,
  'AnotherUserProfile'
>;

type FlashStackScreenRouteProp = RouteProp<
  FlashStackParamList,
  'AnotherUserProfileFromFlash'
>;

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

type MyPageNavigationProp = StackNavigationProp<
  MyPageStackParamList,
  'MyProfile'
>;

type SearchStackNavigationProp = StackNavigationProp<
  SearchStackParamList,
  'AnotherUserProfile'
>;

type FlashStackNavigationProp = StackNavigationProp<
  FlashStackParamList,
  'AnotherUserProfileFromFlash'
>;

type ChatRoomStackNavigationProp = StackNavigationProp<
  ChatRoomStackParamParamList,
  'Profile'
>;

type Props = {
  route:
    | MyPageStackScreenRouteProp
    | ProfileStackScreenRouteProp
    | SearchScreenRouteProp
    | FlashStackScreenRouteProp;
  navigation: RootNavigationProp &
    MyPageNavigationProp &
    SearchStackNavigationProp &
    ChatRoomStackNavigationProp;
};

const {height} = Dimensions.get('window');

export const Container = ({route, navigation}: Props) => {
  // 自分以外のユーザーのプロフィールの場合はrouteにデータが存在する
  const routeParam = route && route.params;

  const referenceId = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });

  const user = useSelector((state: RootState) => {
    if (!routeParam) {
      return state.userReducer.user!;
    }
  }, shallowEqual);

  const posts = useSelector((state: RootState) => {
    if (!routeParam) {
      return selectAllPosts(state);
    }
  }, shallowEqual);

  const flashes = useSelector((state: RootState) => {
    return selectAllFlashes(state);
  }, shallowEqual);

  const creatingFlash = useSelector((state: RootState) => {
    if (!routeParam) {
      return state.indexReducer.creatingFlash;
    }
  });

  const restUserDataForFlashes = useMemo(() => {
    if (routeParam) {
      const {flashes, ...restUserData} = routeParam; // eslint-disable-line
      return restUserData;
    } else {
      const {display, lat, lng, ...restUserData} = user!; // eslint-disable-line
      return {...restUserData, posts: posts!};
    }
  }, [routeParam, user, posts]);

  useLayoutEffect(() => {
    if (route.name !== 'MyProfile' && routeParam) {
      navigation.setOptions({headerTitle: routeParam.name});
    }
  }, [navigation, route.name, routeParam]);

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

  // バックボタンによるtransitionに対しての責務を持ったリスナー
  useEffect(() => {
    if (route.name === 'AnotherUserProfileFromFlash') {
      const unsbscribe = navigation.addListener('transitionStart', () => {
        if (height < X_HEIGHT) {
          StatusBar.setHidden(true);
        } else {
          StatusBar.setBarStyle('light-content');
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
    if (routeParam) {
      dispatch(createRoomThunk(routeParam))
        .then(unwrapResult)
        .then((payload) => {
          const selectedRoom = selectRoom(payload.id);
          if (selectedRoom) {
            navigation.push('ChatRoomStack', {
              screen: 'ChatRoom',
              params: {
                id: selectedRoom.id,
                partner: selectedRoom.partner,
                timestamp: selectedRoom.timestamp,
                messages: selectedRoom.messages,
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
            flashes: routeParam ? routeParam.flashes : undefined, // 自分のプロフィールからのみflashesプロパティをundefiend
            user: restUserDataForFlashes,
          },
        ],
        index: 0,
      },
    });
  };

  return (
    <UserProfile
      user={{
        id: routeParam ? routeParam.id : user!.id,
        name: routeParam ? routeParam.name : user!.name,
        image: routeParam ? routeParam.image : user!.image,
        introduce: routeParam ? routeParam.introduce : user!.introduce,
      }}
      referenceId={referenceId}
      posts={routeParam ? routeParam.posts : posts!}
      flashes={
        routeParam
          ? {
              entites: routeParam.flashes.entities,
              isAllAlreadyViewd: routeParam.flashes.isAllAlreadyViewed,
            }
          : {
              entites: flashes,
              isAllAlreadyViewd: false,
            }
      }
      creatingFlash={creatingFlash}
      navigateToPost={pushPost}
      navigateToUserEdit={pushUserEdit}
      navigateToChatRoom={pushChatRoom}
      navigateToTakeFlash={pushTakeFlash}
      navigateToFlashes={pushFlashes}
    />
  );
};
