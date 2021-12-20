import {axios, addBearer, baseUrl, getIdToken} from '../export';

import {
  ResponseForGetApplyingGroups,
  ResponseForGetAppliedGroups,
} from './types';

export const getRequestToAppliedGroups = async () => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetAppliedGroups>(
    `${baseUrl}/applying_groups?group_type=applied`,
    addBearer(idToken),
  );
};

export const getRequestToApplyingGroups = async () => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetApplyingGroups>(
    `${baseUrl}/applying_groups`,
    addBearer(idToken),
  );
};

export const postRequestApplyingGroups = async ({userId}: {userId: string}) => {
  const idToken = await getIdToken();
  return await axios.post(
    `${baseUrl}/applying_groups`,
    {
      to: userId,
    },
    addBearer(idToken),
  );
};

export const deleteRequestToApplyingGroups = async ({id}: {id: number}) => {
  const idToken = await getIdToken();
  return await axios.delete<Number>(
    `${baseUrl}/applying_groups/${id}`,
    addBearer(idToken),
  );
};
