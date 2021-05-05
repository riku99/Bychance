import {User} from './user';
import {Post} from './posts';
import {TalkRoom} from './talkRooms';
import {Message} from './messages';
import {FlashesData} from '../components/pages/Flashes/types';

export type AnotherUser = Omit<User, 'display' | 'lat' | 'lng'> & {
  posts: Post[];
  flashes: FlashesData;
};

export type ReceivedMessageData = {
  room: TalkRoom;
  sender: AnotherUser;
  message: Message;
};
