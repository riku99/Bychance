import {axios, addBearer, baseUrl, getIdToken} from '../export';
import {GetRequestToActive} from './types';

export const getRequestToActiveData = async () => {
  const idToken = await getIdToken();
  return await axios.get<GetRequestToActive['response']>(
    `${baseUrl}/active?group_type=applied`,
    addBearer(idToken),
  );
};
