import {StampValues} from '~/types';

export type ResponseForGetStamps = {
  [key: string]: {
    userIds: string[];
  };
};

export type ResponseForPostFlashStamps = {
  ownerId: string;
  flashId: number;
  value: StampValues;
  userId: string;
};
