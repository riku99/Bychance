import React, {useEffect, useMemo} from 'react';
import {StatusBar, Dimensions} from 'react-native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {unwrapResult} from '@reduxjs/toolkit';

import {RootStackParamList} from '../../screens/Root';
import {ProfileStackParamList} from '../../screens/Profile';
import {SearchStackParamList} from '../../screens/Search';
import {FlashStackParamList} from '../../screens/Flash';
import {UserProfile} from '../../components/users/UserProfile';
import {createRoomThunk} from '../../actions/rooms';
import {RootState, AppDispatch} from '../../redux/index';
import {Post, selectAllPosts} from '../../redux/post';
import {selectAllFlashes} from '../../redux/flashes';
import {selectRoom} from '../../redux/rooms';
import {X_HEIGHT} from '../../constants/device';
import {alertSomeError} from '../../helpers/error';

type ProfileStackScreenRouteProp = RouteProp<
  ProfileStackParamList,
  'UserProfile'
>;

type SearchScreenRouteProp = RouteProp<
  SearchStackParamList,
  'AnotherUserProfile'
>;

type FlashStackScreenRouteProp = RouteProp<
  FlashStackParamList,
  'AnotherUserProfileFromFlash'
>;

type Props = {
  route:
    | ProfileStackScreenRouteProp
    | SearchScreenRouteProp
    | FlashStackScreenRouteProp;
};

type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

type ProfileNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'UserProfile'
>;

type SearchStackNavigationProp = StackNavigationProp<
  SearchStackParamList,
  'AnotherUserProfile'
>;

type FlashStackNavigationProp = StackNavigationProp<
  FlashStackParamList,
  'AnotherUserProfileFromFlash'
>;

const {height} = Dimensions.get('window');

export const Container = ({route}: Props) => {
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

  const rootStackNavigation = useNavigation<RootNavigationProp>();

  const profileStackNavigation = useNavigation<ProfileNavigationProp>();

  const searchSrackNavigation = useNavigation<SearchStackNavigationProp>();

  const flashStackNavigation = useNavigation<FlashStackNavigationProp>();

  // ナビゲーションのジェスチャーが始まった場合の責務を持ったリスナー
  useEffect(() => {
    if (route.name === 'AnotherUserProfileFromFlash') {
      const unsbscribe = flashStackNavigation.addListener(
        'gestureStart',
        () => {
          if (height < X_HEIGHT) {
            StatusBar.setHidden(true);
          } else {
            StatusBar.setBarStyle('light-content');
          }
        },
      );

      return unsbscribe;
    }
  }, [flashStackNavigation, route]);

  // transitionが終了、またジェスチャーの終了で他のスクリーンに遷移しなかった場合の責務を持ったリスナー
  useEffect(() => {
    if (route.name === 'AnotherUserProfileFromFlash') {
      const unsbscribe = flashStackNavigation.addListener(
        'transitionEnd',
        (e) => {
          if (!e.data.closing) {
            StatusBar.setBarStyle('default');
            StatusBar.setHidden(false);
          }
        },
      );

      return unsbscribe;
    }
  }, [flashStackNavigation, route]);

  // バックボタンによるtransitionに対しての責務を持ったリスナー
  useEffect(() => {
    if (route.name === 'AnotherUserProfileFromFlash') {
      const unsbscribe = flashStackNavigation.addListener(
        'transitionStart',
        () => {
          if (height < X_HEIGHT) {
            StatusBar.setHidden(true);
          } else {
            StatusBar.setBarStyle('light-content');
          }
        },
      );

      return unsbscribe;
    }
  }, [flashStackNavigation, route]);

  const pushPost = (post: Post) => {
    if (route.name === 'UserProfile') {
      profileStackNavigation.push('Post', post);
    } else if (route.name === 'AnotherUserProfile') {
      searchSrackNavigation.push('Post', post);
    } else if (route.name === 'AnotherUserProfileFromFlash') {
      flashStackNavigation.push('Post', post);
    }
  };

  const pushUserEdit = () => {
    rootStackNavigation.push('UserEdit');
  };

  const pushTakeFlash = () => {
    rootStackNavigation.push('TakeFlash');
  };

  const dispatch: AppDispatch = useDispatch();

  const pushChatRoom = () => {
    if (routeParam) {
      dispatch(createRoomThunk(routeParam))
        .then(unwrapResult)
        .then((payload) => {
          const selectedRoom = selectRoom(payload.id);
          if (selectedRoom) {
            rootStackNavigation.push('ChatRoom', {
              id: selectedRoom.id,
              partner: selectedRoom.partner,
              timestamp: selectedRoom.timestamp,
              messages: selectedRoom.messages,
            });
          } else {
            alertSomeError();
          }
        });
    }
  };

  const pushFlashes = () => {
    rootStackNavigation.push('Flashes', {
      screen: 'Flashes',
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
      flashes={flashes}
      creatingFlash={creatingFlash}
      navigateToPost={pushPost}
      navigateToUserEdit={pushUserEdit}
      navigateToChatRoom={pushChatRoom}
      navigateToTakeFlash={pushTakeFlash}
      navigateToFlashes={pushFlashes}
    />
  );
};
