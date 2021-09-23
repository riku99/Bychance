import {addBearer, axios, baseUrl, checkKeychain} from '../export';
import {ResponseForGetPrivateTime, ResponseForPostPrivateTime} from './types';

export const getRequestToPrivateTime = async () => {
  const credentials = await checkKeychain();
  return await axios.get<ResponseForGetPrivateTime>(
    `${baseUrl}/privateTime?id=${credentials?.id}`,
    addBearer(credentials?.token),
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
  const credentials = await checkKeychain();
  return await axios.post<ResponseForPostPrivateTime>(
    `${baseUrl}/privateTime?id=${credentials?.id}`,
    {startHours, startMinutes, endHours, endMinutes},
    addBearer(credentials?.token),
  );
};

export const deleteRequestToPrivateTime = async (id: number) => {
  const credentials = await checkKeychain();
  return await axios.delete(
    `${baseUrl}/privateTime/${id}?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};
