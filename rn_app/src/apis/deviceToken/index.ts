import {axios, addBearer, baseUrl, getIdToken} from '../export';

export const postRequestToDeviceToken = async (deviceToken: string) => {
  const idToken = await getIdToken();
  return await axios.post(
    `${baseUrl}/device_token`,
    {token: deviceToken},
    addBearer(idToken),
  );
};
