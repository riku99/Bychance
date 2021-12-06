import {axios, addBearer, baseUrl, getIdToken} from '../export';
import {
  ResponseForGetRefreshMyData,
  ResponseForGetUserPageInfo,
  ResponseForPatchUsers,
} from './types';
import {LoginData} from '~/apis/sessions/types';

export const postRequestToUsers = async ({
  name,
  token,
}: {
  name: string;
  token: string;
}) => {
  return await axios.post<LoginData>(
    `${baseUrl}/users`,
    {name},
    addBearer(token),
  );
};

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
  const idToken = await getIdToken();
  return await axios.patch<ResponseForPatchUsers>(
    `${baseUrl}/users`,
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
    addBearer(idToken),
  );
};

export const deleteRequestToUsersLocation = async () => {
  const idToken = await getIdToken();
  return await axios.delete(`${baseUrl}/users/locations`, addBearer(idToken));
};

export const getRequestToMyRefreshData = async () => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetRefreshMyData>(
    `${baseUrl}/users/my_refresh_data`,
    addBearer(idToken),
  );
};

export const patchRequestToUsersLocaiton = async ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  const idToken = await getIdToken();
  return await axios.patch(
    `${baseUrl}/users/locations`,
    {
      lat,
      lng,
    },
    addBearer(idToken),
  );
};

export const getRequestToUsersInfo = async (userId: string) => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetUserPageInfo>(
    `${baseUrl}/users/${userId}/page_info`,
    addBearer(idToken),
  );
};

export const getRequestToUsersIsDisplayedToOtherUsers = async () => {
  const idToken = await getIdToken();
  return await axios.get<boolean>(
    `${baseUrl}/users/is_displayed`,
    addBearer(idToken),
  );
};

export const deleteRequestToUsersGroupId = async () => {
  const idToken = await getIdToken();
  return await axios.delete(`${baseUrl}/users/group_id`, addBearer(idToken));
};

export const putRequestToUsersOnCall = async (value: boolean) => {
  const idToken = await getIdToken();
  return await axios.put(
    `${baseUrl}/users/on_call`,
    {value},
    addBearer(idToken),
  );
};
