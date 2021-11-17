import {axios, addBearer, baseUrl, getIdToken} from '../export';
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
  const idToken = await getIdToken();
  return await axios.post<ResponseForPostFlashes>(
    `${baseUrl}/flashes`,
    {
      source,
      sourceType,
      ext,
    },
    addBearer(idToken),
  );
};

export const deleteRequestToFlashes = async ({flashId}: {flashId: number}) => {
  const idToken = await getIdToken();
  await axios.delete(`${baseUrl}/flashes/${flashId}`, addBearer(idToken));
};

export const postRequestToFlashesViewed = async ({
  flashId,
}: {
  flashId: number;
}) => {
  const idToken = await getIdToken();
  await axios.post(`${baseUrl}/flashes/viewed`, {flashId}, addBearer(idToken));
};
