import {addBearer, axios, baseUrl, checkKeychain} from '../export';
import {ResponseForGetPrivateZone, ResponseForPostPrivateZone} from './types';

export const getRequestToPrivateZone = async () => {
  const credentials = await checkKeychain();
  return await axios.get<ResponseForGetPrivateZone>(
    `${baseUrl}/privateZone?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};

export const postRequestToPrivateZone = async ({
  address,
  lat,
  lng,
}: {
  address: string;
  lat: number;
  lng: number;
}) => {
  const credentials = await checkKeychain();
  return await axios.post<ResponseForPostPrivateZone>(
    `${baseUrl}/privateZone?id=${credentials?.id}`,
    {
      address,
      lat,
      lng,
    },
    addBearer(credentials?.token),
  );
};

export const deleteRequestToPrivateZone = async (id: number) => {
  const credentials = await checkKeychain();
  return await axios.delete(
    `${baseUrl}/privateZone/${id}?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};
