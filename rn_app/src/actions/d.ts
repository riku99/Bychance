import {AxiosError} from 'axios';
import {User} from '../redux/user';
import {Post} from '../redux/post';
import {Room} from '../redux/rooms';
import {MessageType} from '../redux/messages';
import {Flash} from '../redux/flashes';
import {AnotherUser} from '../redux/getUsers';

export type rejectPayload =
  | {errorType: 'loginError'}
  | {errorType: 'invalidError'; message: string}
  | {errorType: 'someError'};

export type basicAxiosError = AxiosError<
  {errorType: 'invalidError'; message: string} | {errorType: 'loginError'}
>;

export type SuccessfullLoginData = {
  user: User;
  posts: Post[];
  rooms: Room[];
  chatPartners: AnotherUser[];
  messages: MessageType[];
  flashes: Flash[];
};
