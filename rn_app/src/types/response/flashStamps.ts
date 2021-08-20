import {StampValues} from '../domain/FlashStamps';

export type GetFlashStampsResponse = {
  id: number;
  createdAt: string;
  value: StampValues;
  userId: string;
  flashId: number;
};
