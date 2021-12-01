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
