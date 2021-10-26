import {addBearer, axios, baseUrl, checkKeychain} from '../export';
import {
  ResponseForGetRefreshMyData,
  ResponseForGetUserPageInfo,
  ResponseForPatchUsers,
} from './types';

type EditArg = {
  name: string;
  introduce: string;
  avatar?: string;
  avatarExt?: string | null;
  deleteAvatar: boolean;
  message: string;
  backGroundItem?: string;
  backGroundItemType?: 'image' | 'video';
  deleteBackGroundItem: boolean;
  backGroundItemExt?: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
};

export const patchRequestToUsers = async ({
  name,
  introduce,
  avatar,
  avatarExt,
  deleteAvatar,
  message,
  backGroundItem,
  backGroundItemType,
  deleteBackGroundItem,
  backGroundItemExt,
  instagram,
  twitter,
  youtube,
  tiktok,
}: EditArg) => {
  const credentials = await checkKeychain();
  return await axios.patch<ResponseForPatchUsers>(
    `${baseUrl}/users?id=${credentials?.id}`,
    {
      name,
      introduce,
      avatar,
      avatarExt,
      deleteAvatar,
      statusMessage: message,
      backGroundItem,
      backGroundItemType,
      deleteBackGroundItem,
      backGroundItemExt,
      instagram,
      twitter,
      youtube,
      tiktok,
    },
    addBearer(credentials?.token),
  );
};

export const deleteRequestToUsersLocation = async () => {
  const credentials = await checkKeychain();
  return await axios.delete(
    `${baseUrl}/users/locations?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};

export const getRequestToMyRefreshData = async () => {
  const credentials = await checkKeychain();
  return await axios.get<ResponseForGetRefreshMyData>(
    `${baseUrl}/users/my_refresh_data?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};

export const patchRequestToUsersLocaiton = async ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  const credentials = await checkKeychain();
  return await axios.patch(
    `${baseUrl}/users/locations?id=${credentials?.id}`,
    {
      lat,
      lng,
    },
    addBearer(credentials?.token),
  );
};

export const getRequestToUsersInfo = async (userId: string) => {
  const credentials = await checkKeychain();
  return await axios.get<ResponseForGetUserPageInfo>(
    `${baseUrl}/users/${userId}/page_info?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};

export const getRequestToUsersIsDisplayedToOtherUsers = async () => {
  const credentials = await checkKeychain();
  console.log('cred');
  console.log(credentials);
  return await axios.get<boolean>(
    `${baseUrl}/users/is_displayed?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};

export const deleteRequestToUsersGroupId = async () => {
  const credentials = await checkKeychain();
  return await axios.delete(
    `${baseUrl}/users/group_id?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};
