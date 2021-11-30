import {axios, addBearer, baseUrl, getIdToken} from '../export';

export const postRequestToBlocks = async ({blockTo}: {blockTo: string}) => {
  const idToken = await getIdToken();
  await axios.post(`${baseUrl}/users/block`, {blockTo}, addBearer(idToken));
};

export const deleteRequestToBlocks = async ({userId}: {userId: string}) => {
  const idToken = await getIdToken();
  await axios.delete(`${baseUrl}/users/${userId}/block`, addBearer(idToken));
};
