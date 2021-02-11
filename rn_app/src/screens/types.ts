import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {RootStackParamList} from './Root';
import {MyPageStackParamList, UserPageScreenGroupParamList} from './UserPage';
import {ChatRoomStackParamList} from './ChatRoom';
import {UserEditStackParamList} from './UserEdit';
import {CreatePostStackParamList} from './CreatePost';
import {SearchUsersStackParamList} from './SearchUsers';
import {FlashesDataAndUser} from '../components/pages/Flashes/ShowFlash';
import {PartiallyPartial} from '../constants/types';

// navigationの型たち
export type RootNavigationProp<
  T extends keyof RootStackParamList
> = StackNavigationProp<RootStackParamList, T>;

export type MyPageNavigationProp<
  T extends keyof MyPageStackParamList
> = StackNavigationProp<MyPageStackParamList, T>;

export type UserPageNavigationProp<
  T extends keyof UserPageScreenGroupParamList
> = StackNavigationProp<UserPageScreenGroupParamList, T>;

export type ChatRoomStackNavigationProp<
  T extends keyof ChatRoomStackParamList
> = StackNavigationProp<ChatRoomStackParamList, T>;

export type UserEditNavigationProp<
  T extends keyof UserEditStackParamList
> = StackNavigationProp<UserEditStackParamList, T>;

export type CreatePostStackNavigationProp<
  T extends keyof CreatePostStackParamList
> = StackNavigationProp<CreatePostStackParamList, T>;

export type SearchUsersStackNavigationProp<
  T extends keyof SearchUsersStackParamList
> = StackNavigationProp<SearchUsersStackParamList, T>;

// routeの型たち
export type MyPageStackRouteProp<
  T extends keyof MyPageStackParamList
> = RouteProp<MyPageStackParamList, T>;

export type UserPageStackRouteProp<
  T extends keyof UserPageScreenGroupParamList
> = RouteProp<UserPageScreenGroupParamList, T>;

export type UserEditRouteProp<
  T extends keyof UserEditStackParamList
> = RouteProp<UserEditStackParamList, T>;

// その他
export type PartialFlashesDataAndUser = PartiallyPartial<
  FlashesDataAndUser,
  'flashesData'
>;
