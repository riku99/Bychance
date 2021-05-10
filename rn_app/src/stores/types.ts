import {User} from './user';
import {Post} from './posts';
import {TalkRoom} from './talkRooms';
import {TalkRoomMessage} from './messages';
import {FlashesData} from '../components/pages/Flashes/types';

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
      sender: {name: string; avatar: string | null};
      message: TalkRoomMessage;
    };
