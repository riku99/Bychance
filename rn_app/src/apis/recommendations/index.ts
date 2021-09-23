import {axios, addBearer, baseUrl, checkKeychain} from '../export';
import {ResponseForGetRecommendations} from './types';

export const getRequestToRecommendations = async ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  const credentials = await checkKeychain();
  return await axios.get<ResponseForGetRecommendations>(
    `${baseUrl}/recommendations?id=${credentials?.id}&lat=${lat}&lng=${lng}`,
    addBearer(credentials?.token),
  );
};

export const postResuestToUserHideRecommendation = async ({
  id,
}: {
  id: number;
}) => {
  const credentials = await checkKeychain();
  return await axios.post(
    `${baseUrl}/user_hide_recommendations?id=${credentials?.id}`,
    {id},
    addBearer(credentials?.token),
  );
};
