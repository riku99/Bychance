import {User} from './user';
import {Post} from './posts';
import {TalkRoom} from './talkRooms';
import {TalkRoomMessage} from './talkRoomMessages';
import {Flash} from './flashes';

export type ClientData = {
  user: User;
  posts: Post[];
  rooms: TalkRoom[];
  messages: TalkRoomMessage[];
  flashes: Flash[];
  chatPartners: AnotherUser[];
};

// 自分以外のユーザーが持つデータ。データそのもの(entiites)以外にも閲覧データとか必要なので定義
export type FlashesData = {
  entities: Flash[];
  alreadyViewed: number[];
  isAllAlreadyViewed?: boolean;
};

export type AnotherUser = Omit<User, 'display'> & {
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
