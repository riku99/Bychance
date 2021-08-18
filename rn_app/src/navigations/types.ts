import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {MyPageStackParamList, UserPageScreenGroupParamList} from './UserPage';
import {TalkRoomStackParamList} from './TalkRoom';
import {UserEditStackParamList} from './UserEdit';
import {CreatePostStackParamList} from './CreatePost';
// import {SearchUsersStackParamList} from './NearbyUsers';
import {FlashesStackParamList} from './Flashes';

// navigationの型たち 順次修正していく
export type MyPageNavigationProp<
  T extends keyof MyPageStackParamList
> = StackNavigationProp<MyPageStackParamList, T>;

// export type UserPageNavigationProp<
//   T extends keyof UserPageScreenGroupParamList
// > = StackNavigationProp<UserPageScreenGroupParamList, T>;

export type TalkRoomStackNavigationProp<
  T extends keyof TalkRoomStackParamList
> = StackNavigationProp<TalkRoomStackParamList, T>;

export type UserEditNavigationProp<
  T extends keyof UserEditStackParamList
> = StackNavigationProp<UserEditStackParamList, T>;

export type CreatePostStackNavigationProp<
  T extends keyof CreatePostStackParamList
> = StackNavigationProp<CreatePostStackParamList, T>;

// export type SearchUsersStackNavigationProp<
//   T extends keyof SearchUsersStackParamList
// > = StackNavigationProp<SearchUsersStackParamList, T>;

export type FlashStackNavigationProp<
  T extends keyof FlashesStackParamList
> = StackNavigationProp<FlashesStackParamList, T>;

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

export type FlashesRouteProp<T extends keyof FlashesStackParamList> = RouteProp<
  FlashesStackParamList,
  T
>;
