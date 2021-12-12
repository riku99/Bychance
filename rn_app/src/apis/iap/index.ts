import {axios, baseUrl, getIdToken, addBearer} from '../export';
import {PostRequestToIapVerify} from './types';

export const postRequestToIapVerify = async (
  body: PostRequestToIapVerify['payload'],
) => {
  const idToken = await getIdToken();
  return await axios.post(`${baseUrl}/iap/verify`, body, addBearer(idToken));
};
