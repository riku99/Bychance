import {axios, addBearer, baseUrl, getIdToken} from '../export';
import {ResponseForGetTalkRoomData, ResponseForPostTalkRooms} from './types';

export const postRequestToTalkRooms = async (partner: {id: string}) => {
  const idToken = await getIdToken();
  return await axios.post<ResponseForPostTalkRooms>(
    `${baseUrl}/talkRooms`,
    {partnerId: partner.id},
    addBearer(idToken),
  );
};

export const deleteRequestToTalkRooms = async ({
  talkRoomId,
}: {
  talkRoomId: number;
}) => {
  const idToken = await getIdToken();
  return await axios.delete(
    `${baseUrl}/talkRooms/${talkRoomId}`,
    addBearer(idToken),
  );
};

export const getRequestToTalkRooms = async () => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetTalkRoomData>(
    `${baseUrl}/talk_rooms`,
    addBearer(idToken),
  );
};
