type PostRequestToRTCTokenPaylaod = {
  channelName: string;
  otherUserId: string;
};
type PostRequestToRTCTokenResponse = {
  token: string;
};
export type PostRequestToRTCToken = {
  response: PostRequestToRTCTokenResponse;
  payload: PostRequestToRTCTokenPaylaod;
};
