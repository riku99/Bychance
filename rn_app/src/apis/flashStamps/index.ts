import {addBearer, axios, baseUrl, checkKeychain} from '../export';
import {ResponseForGetStamps, ResponseForPostFlashStamps} from './types';

export const getRequestToFlashStamps = async ({flashId}: {flashId: number}) => {
  const credentials = await checkKeychain();
  return await axios.get<ResponseForGetStamps>(
    `${baseUrl}/flashes/${flashId}/stamps?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};

export const postRequestToFlashStamps = async ({
  value,
  flashId,
}: {
  value: string;
  flashId: number;
}) => {
  const credentials = await checkKeychain();
  return await axios.post<ResponseForPostFlashStamps>(
    `${baseUrl}/flashStamps?id=${credentials?.id}`,
    {
      flashId,
      value,
    },
    addBearer(credentials?.token),
  );
};
