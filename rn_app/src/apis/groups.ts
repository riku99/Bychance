import {addBearer} from '~/helpers/requestHeaders';
import {checkKeychain} from '~/helpers/credentials';
import {default as axios} from 'axios';

import {baseUrl} from '~/constants/url';

export const postRequestToGroups = async ({ownerId}: {ownerId: string}) => {
  const credentials = await checkKeychain();
  return await axios.post(
    `${baseUrl}/groups?id=${credentials?.id}`,
    {ownerId},
    addBearer(credentials?.token),
  );
};
