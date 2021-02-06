import {Flash} from '../../../redux/flashes';
import {Post} from '../../../redux/post';

export type FlashesData = {
  entities: Flash[];
  alreadyViewed: number[];
  isAllAlreadyViewed?: boolean;
};

export type FlashesDataAndUser = {
  flashesData: FlashesData;
  user: {
    id: number;
    name: string;
    introduce: string;
    image: string | null;
    message: string;
    posts: Post[];
  };
};

export type FlashesWithUser = {
  flashes: {
    entities: Flash[];
    alreadyViewed: number[];
    isAllAlreadyViewed?: boolean;
  };
  user: {
    id: number;
    name: string;
    introduce: string;
    image: string | null;
    message: string;
    posts: Post[];
  };
};
