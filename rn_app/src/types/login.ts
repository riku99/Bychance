import {User} from '~/stores/user';
import {Flash} from '~/stores/flashes';
import {FlashStamp} from '~/stores/flashStamps';

// ログインした時に返されるデータ
export type SuccessfullLoginData = {
  user: User;
  flashes: Flash[];
  flashStamps: FlashStamp[];
};
