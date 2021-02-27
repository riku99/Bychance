import {Flash} from '../../../redux/flashes';

export type FlashesData = {
  entities: Flash[];
  alreadyViewed: number[];
  isAllAlreadyViewed?: boolean;
};
