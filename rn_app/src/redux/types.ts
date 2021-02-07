import {Room} from './rooms';
import {AnotherUser} from './getUsers';
import {Message} from './messages';

export type ReceivedMessageData = {
  room: Room;
  sender: AnotherUser;
  message: Message;
};
