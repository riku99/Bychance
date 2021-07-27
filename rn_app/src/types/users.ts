import {User} from '~/stores/user';
import {Post} from '~/stores/posts';
import {FlashesData} from './flashes';

export type AnotherUser = Omit<User, 'display'> & {
  posts: Post[];
  flashes: FlashesData;
};
