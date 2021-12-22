import {axios, baseUrl, getIdToken, addBearer} from '../export';
import {
  PostRequestToRTCToken,
  GetRequestToCallHistories,
  PutRequestToCallHistoryConnected,
} from './types';

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

export const getRequestToCallHistories = async ({
  query,
}: {
  query: GetRequestToCallHistories['query'];
}) => {
  const idToken = await getIdToken();
  return await axios.get<GetRequestToCallHistories['response']>(
    `${baseUrl}/call_histories?type=${query.type}`,
    addBearer(idToken),
  );
};

export const putRequestToCallHistoryConnected = async ({
  params,
}: {
  params: PutRequestToCallHistoryConnected['params'];
}) => {
  const idToken = await getIdToken();
  return await axios.put(
    `${baseUrl}/call_histories/${params.callHistoryId}/connected`,
    {},
    addBearer(idToken),
  );
};
