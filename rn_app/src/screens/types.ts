import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList} from './Root';
import {MyPageStackParamList, ProfileScreensGroupParamList} from './Profile';
import {FlashesDataAndUser} from '../components/pages/Flashes/ShowFlash';
import {PartiallyPartial} from '../constants/d';

export type RootNavigationProp<
  T extends keyof RootStackParamList
> = StackNavigationProp<RootStackParamList, T>;

export type MyPageNavigationProp<
  T extends keyof MyPageStackParamList
> = StackNavigationProp<MyPageStackParamList, T>;

export type UserPageNavigationProp<
  T extends keyof ProfileScreensGroupParamList
> = StackNavigationProp<ProfileScreensGroupParamList, T>;

export type PartialFlashesDataAndUser = PartiallyPartial<
  FlashesDataAndUser,
  'flashesData'
>;
