import {axios, addBearer, baseUrl, getIdToken} from '../export';
import {ResponseForGetPrivateTime, ResponseForPostPrivateTime} from './types';

export const getRequestToPrivateTime = async () => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetPrivateTime>(
    `${baseUrl}/privateTime`,
    addBearer(idToken),
  );
};

export const postRequestToPrivateTime = async ({
  startHours,
  startMinutes,
  endHours,
  endMinutes,
}: {
  startHours: number;
  startMinutes: number;
  endHours: number;
  endMinutes: number;
}) => {
  const idToken = await getIdToken();
  return await axios.post<ResponseForPostPrivateTime>(
    `${baseUrl}/privateTime`,
    {startHours, startMinutes, endHours, endMinutes},
    addBearer(idToken),
  );
};

export const deleteRequestToPrivateTime = async (id: number) => {
  const idToken = await getIdToken();
  return await axios.delete(`${baseUrl}/privateTime/${id}`, addBearer(idToken));
};
