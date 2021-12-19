import {axios, addBearer, baseUrl, getIdToken} from '../export';

export const postRequestToDeviceToken = async (payload: {
  newToken: string;
  oldToken?: string;
}) => {
  const idToken = await getIdToken();
  return await axios.post(
    `${baseUrl}/device_token`,
    payload,
    addBearer(idToken),
  );
};
