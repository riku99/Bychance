import {AxiosError} from 'axios';
import {User} from '../stores/user';
import {Post} from '../stores/posts';
import {Room} from '../stores/rooms';
import {Message} from '../stores/messages';
import {Flash} from '../stores/flashes';
import {AnotherUser} from '../stores/types';

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
  messages: Message[];
  flashes: Flash[];
};
