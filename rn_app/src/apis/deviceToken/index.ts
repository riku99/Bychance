import {addBearer, checkKeychain, axios, baseUrl} from '../export';

export const postRequestToDeviceToken = async (deviceToken: string) => {
  const credentials = await checkKeychain();
  return await axios.post(
    `${baseUrl}/device_token?id=${credentials?.id}`,
    {token: deviceToken},
    addBearer(credentials?.token),
  );
};
