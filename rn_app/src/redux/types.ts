import {User} from './user';
import {Post} from './post';
import {Room} from './rooms';
import {Flash} from './flashes';
import {Message} from './messages';

// Flashを表示するためのデータ
export type FlashesData = {
  entities: Flash[];
  alreadyViewed: number[];
  isAllAlreadyViewed?: boolean;
};

export type AnotherUser = Omit<User, 'display' | 'lat' | 'lng'> & {
  posts: Post[];
  flashes: FlashesData;
};

export type ReceivedMessageData = {
  room: Room;
  sender: AnotherUser;
  message: Message;
};
