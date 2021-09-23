import {axios, addBearer, checkKeychain, baseUrl} from '../export';
import {ResponseForPostFlashes} from './types';

export const postRequestToFlashes = async ({
  source,
  sourceType,
  ext,
}: {
  source: string;
  sourceType: 'image' | 'video';
  ext: string;
}) => {
  const credentials = await checkKeychain();
  return await axios.post<ResponseForPostFlashes>(
    `${baseUrl}/flashes?id=${credentials?.id}`,
    {
      source,
      sourceType,
      ext,
    },
    addBearer(credentials?.token),
  );
};

export const deleteRequestToFlashes = async ({flashId}: {flashId: number}) => {
  const credentials = await checkKeychain();
  await axios.delete(
    `${baseUrl}/flashes/${flashId}?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};

export const postRequestToFlashesViewed = async ({
  flashId,
}: {
  flashId: number;
}) => {
  const credentials = await checkKeychain();
  await axios.post(
    `${baseUrl}/flashes/viewed?id=${credentials?.id}`,
    {flashId},
    addBearer(credentials?.token),
  );
};
