import {axios, addBearer, baseUrl, checkKeychain} from '../export';
import {ResponseForGetNearbyUsers} from './types';

export const getRequestToNearbyUsers = async ({range}: {range: number}) => {
  const credentials = await checkKeychain();
  return await axios.get<ResponseForGetNearbyUsers>(
    `${baseUrl}/users/nearby?id=${credentials?.id}&range=${range}`,
    addBearer(credentials?.token),
  );
};
