import {User} from '~/stores/user';
import {Post} from '~/stores/posts';
import {TalkRoom} from '~/stores/talkRooms';
import {TalkRoomMessage} from '~/stores/talkRoomMessages';
import {Flash} from '~/stores/flashes';
import {FlashStamp} from '~/stores/flashStamps';
import {AnotherUser} from './users';

// ログインした時に返されるデータ
export type SuccessfullLoginData = {
  user: User;
  posts: Post[];
  rooms: TalkRoom[];
  messages: TalkRoomMessage[];
  flashes: Flash[];
  chatPartners: AnotherUser[];
  flashStamps: FlashStamp[];
};
