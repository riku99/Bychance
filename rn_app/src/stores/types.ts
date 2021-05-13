import {User} from './user';
import {Post} from './posts';
import {TalkRoom} from './talkRooms';
import {TalkRoomMessage} from './talkRoomMessages';
import {Flash} from './flashes';
import {FlashesData} from '../components/screens/Flashes/types';

export type ClientData = {
  user: User;
  posts: Post[];
  rooms: TalkRoom[];
  messages: TalkRoomMessage[];
  flashes: Flash[];
  chatPartners: AnotherUser[];
};

export type AnotherUser = Omit<User, 'display' | 'lat' | 'lng'> & {
  posts: Post[];
  flashes: FlashesData;
};

export type ReceivedMessageData =
  | {
      isFirstMessage: true;
      room: TalkRoom;
      sender: AnotherUser;
      message: TalkRoomMessage;
    }
  | {
      isFirstMessage: false;
      roomId: number;
      sender: {id: string; name: string; avatar: string | null};
      message: TalkRoomMessage;
    };
