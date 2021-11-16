import {axios, addBearer, baseUrl, getIdToken} from '../export';
import {ResponseForGetStamps, ResponseForPostFlashStamps} from './types';

export const getRequestToFlashStamps = async ({flashId}: {flashId: number}) => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetStamps>(
    `${baseUrl}/flashes/${flashId}/stamps`,
    addBearer(idToken),
  );
};

export const postRequestToFlashStamps = async ({
  value,
  flashId,
}: {
  value: string;
  flashId: number;
}) => {
  const idToken = await getIdToken();
  return await axios.post<ResponseForPostFlashStamps>(
    `${baseUrl}/flashStamps`,
    {
      flashId,
      value,
    },
    addBearer(idToken),
  );
};
