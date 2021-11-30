import {axios, baseUrl, getIdToken, addBearer} from '../export';
import {PostRequestToRTCToken} from './types';

export const postRequesutToRTCToken = async (
  payload: PostRequestToRTCToken['payload'],
) => {
  const idToken = await getIdToken();
  return await axios.post<PostRequestToRTCToken['response']>(
    `${baseUrl}/video_calling/rtc_token`,
    payload,
    addBearer(idToken),
  );
};
