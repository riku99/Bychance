import {addBearer} from '~/helpers/requestHeaders';
import {checkKeychain} from '~/helpers/credentials';
import {default as axios} from 'axios';

import {baseUrl} from '~/constants/url';
import {
  GetApplyingGroupsResponse,
  GetAppliedGroupsResponse,
} from '~/types/response/applyingGroup';

export const getRequestToAppliedGroups = async () => {
  const credentials = await checkKeychain();
  return await axios.get<GetAppliedGroupsResponse>(
    `${baseUrl}/applying_groups?id=${credentials?.id}&type=applied`,
    addBearer(credentials?.token),
  );
};

export const getRequestToApplyingGroups = async () => {
  const credentials = await checkKeychain();
  return await axios.get<GetApplyingGroupsResponse>(
    `${baseUrl}/applying_groups?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};

export const postRequestApplyingGroups = async ({userId}: {userId: string}) => {
  const credentials = await checkKeychain();
  return await axios.post(
    `${baseUrl}/applying_groups?id=${credentials?.id}`,
    {
      to: userId,
    },
    addBearer(credentials?.token),
  );
};

export const deleteRequestToApplyingGroups = async ({id}: {id: number}) => {
  const credentials = await checkKeychain();
  return await axios.delete<Number>(
    `${baseUrl}/applying_groups/${id}?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};
