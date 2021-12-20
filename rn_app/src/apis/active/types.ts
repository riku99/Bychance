import {ResponseForGetTalkRoomData} from '~/apis/talkRooms/types';
import {ResponseForGetAppliedGroups} from '~/apis/applyingGroups/types';

type ResponseForGetRequestToActive = {
  talkRooms: ResponseForGetTalkRoomData;
  isDisplayed: boolean;
  appliedGroups: ResponseForGetAppliedGroups;
};

export type GetRequestToActive = {
  response: ResponseForGetRequestToActive;
};
