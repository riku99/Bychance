import {axios, addBearer, baseUrl, getIdToken} from '../export';
import {ResponseForGetRecommendations} from './types';

export const getRequestToRecommendations = async ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetRecommendations>(
    `${baseUrl}/recommendations&lat=${lat}&lng=${lng}`,
    addBearer(idToken),
  );
};

export const postResuestToUserHideRecommendation = async ({
  id,
}: {
  id: number;
}) => {
  const idToken = await getIdToken();
  return await axios.post(
    `${baseUrl}/user_hide_recommendations`,
    {id},
    addBearer(idToken),
  );
};
