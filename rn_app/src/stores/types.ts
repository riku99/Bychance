import {User} from './user';
import {Flash} from './flashes';
import {FlashStamp} from './flashStamps';

export type ClientData = {
  user: User;
  flashes: Flash[];
  chatPartners: AnotherUser[];
  flashStamps: FlashStamp[];
};

// 自分以外のユーザーが持つデータ。データそのもの(entiites)以外にも閲覧データとか必要なので定義
export type FlashesData = {
  entities: Flash[];
  alreadyViewed: number[];
  isAllAlreadyViewed?: boolean;
};

export type AnotherUser = Omit<User, 'display'> & {
  flashes: FlashesData;
};
