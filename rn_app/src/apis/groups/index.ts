import {addBearer} from '~/helpers/requestHeaders';
import {checkKeychain} from '~/helpers/credentials';
import {default as axios} from 'axios';

import {baseUrl} from '~/constants/url';
import {ResponseForGetGroups} from './types';

const groupsUrl = `${baseUrl}/groups`;

export const postRequestToGroups = async ({ownerId}: {ownerId: string}) => {
  const credentials = await checkKeychain();
  return await axios.post(
    `${groupsUrl}?id=${credentials?.id}`,
    {ownerId},
    addBearer(credentials?.token),
  );
};

export const getRequestToGroups = async () => {
  const credentials = await checkKeychain();
  return await axios.get<ResponseForGetGroups>(
    `${groupsUrl}?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};

export const deleteRequestToGroups = async () => {
  const credentials = await checkKeychain();
  return await axios.delete(
    `${groupsUrl}?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};
