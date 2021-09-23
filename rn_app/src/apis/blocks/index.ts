import {baseUrl, addBearer, checkKeychain, axios} from '../export';

export const postRequestToBlocks = async ({blockTo}: {blockTo: string}) => {
  const credentials = await checkKeychain();

  await axios.post(
    `${baseUrl}/users/block?id=${credentials?.id}`,
    {blockTo},
    addBearer(credentials?.token),
  );
};

export const deleteRequestToBlocks = async ({userId}: {userId: string}) => {
  const credentials = await checkKeychain();
  await axios.delete(
    `${baseUrl}/users/${userId}/block?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};
