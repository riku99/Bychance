import {axios, addBearer, baseUrl, getIdToken} from '../export';
import {ResponseForGetNearbyUsers} from './types';

export const getRequestToNearbyUsers = async ({range}: {range: number}) => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetNearbyUsers>(
    `${baseUrl}/users/nearby?range=${range}`,
    addBearer(idToken),
  );
};
