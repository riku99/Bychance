import {User} from '~/stores/user';
import {Post} from '~/stores/posts';
import {Flash} from '~/stores/flashes';
import {FlashStamp} from '~/stores/flashStamps';

// ログインした時に返されるデータ
export type SuccessfullLoginData = {
  user: User;
  posts: Post[];
  flashes: Flash[];
  flashStamps: FlashStamp[];
};
