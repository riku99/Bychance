import {axios, addBearer, baseUrl, getIdToken} from '../export';
import {ResponseForGetPrivateZone, ResponseForPostPrivateZone} from './types';

export const getRequestToPrivateZone = async () => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetPrivateZone>(
    `${baseUrl}/privateZone`,
    addBearer(idToken),
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
  const idToken = await getIdToken();
  return await axios.post<ResponseForPostPrivateZone>(
    `${baseUrl}/privateZone`,
    {
      address,
      lat,
      lng,
    },
    addBearer(idToken),
  );
};

export const deleteRequestToPrivateZone = async (id: number) => {
  const idToken = await getIdToken();
  return await axios.delete(`${baseUrl}/privateZone/${id}`, addBearer(idToken));
};
