import {addBearer} from '~/helpers/requestHeaders';
import {checkKeychain} from '~/helpers/credentials';
import {default as axios} from 'axios';

import {baseUrl} from '~/constants/url';

export const putRequestToUsersGroupsApplicationEnabled = async (
  value: boolean,
) => {
  const credentials = await checkKeychain();
  return await axios.put(
    `${baseUrl}/users/groups_application_enabled?id=${credentials?.id}`,
    {value},
    addBearer(credentials?.token),
  );
};
