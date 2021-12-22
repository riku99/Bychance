type PostRequestToRTCTokenPaylaod = {
  channelName: string;
  otherUserId: string;
};
type PostRequestToRTCTokenResponse = {
  token: string;
  intUid: number;
};
export type PostRequestToRTCToken = {
  response: PostRequestToRTCTokenResponse;
  payload: PostRequestToRTCTokenPaylaod;
};

export type GetRequestToCallHistories = {
  query: {
    type: 'subscribe' | 'publish';
  };
  response: {
    callHistories: {
      id: number;
      createdAt: Date;
      publisher: {
        id: string;
        name: string;
        avatar: string | null;
      };
    }[];
  };
};

export type PutRequestToCallHistoryConnected = {
  params: {
    callHistoryId: number;
  };
};
