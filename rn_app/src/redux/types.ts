import {User} from './user';
import {Post} from './post';
import {FlashesData} from '../components/pages/Flashes/ShowFlash';
import {Room} from './rooms';
import {Message} from './messages';

export type AnotherUser = Omit<User, 'display' | 'lat' | 'lng'> & {
  posts: Post[];
  flashes: FlashesData;
};

export type ReceivedMessageData = {
  room: Room;
  sender: AnotherUser;
  message: Message;
};
