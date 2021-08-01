import {Post} from '~/stores/posts';
import {FlashesData} from './flashes';
import {User} from './users';

export type AnotherUser = Omit<User, 'display'> & {
  posts: Post[];
  flashes: FlashesData;
};
