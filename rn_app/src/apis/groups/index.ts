import {axios, addBearer, baseUrl, getIdToken} from '../export';

import {ResponseForGetGroups} from './types';

const groupsUrl = `${baseUrl}/groups`;

export const postRequestToGroups = async ({ownerId}: {ownerId: string}) => {
  const idToken = await getIdToken();
  return await axios.post(`${groupsUrl}`, {ownerId}, addBearer(idToken));
};

export const getRequestToGroups = async (userId: string) => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetGroups>(
    `${baseUrl}/users/${userId}/groups`,
    addBearer(idToken),
  );
};

export const deleteRequestToGroups = async () => {
  const idToken = await getIdToken();
  return await axios.delete(`${groupsUrl}`, addBearer(idToken));
};

export const getRequestToGroupMemberWhoBlockTargetUserExists = async ({
  targetUserId,
}: {
  targetUserId: string;
}) => {
  const idToken = await getIdToken();
  return await axios.get<boolean>(
    `${baseUrl}/groups/members/block/${targetUserId}`,
    addBearer(idToken),
  );
};
