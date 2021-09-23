import {addBearer, axios, baseUrl, checkKeychain} from '../export';
import {ResponseForGetTalkRoomData, ResponseForPostTalkRooms} from './types';

export const postRequestToTalkRooms = async (partner: {id: string}) => {
  const credentials = await checkKeychain();
  return await axios.post<ResponseForPostTalkRooms>(
    `${baseUrl}/talkRooms?id=${credentials?.id}`,
    {partnerId: partner.id},
    addBearer(credentials?.token),
  );
};

export const deleteRequestToTalkRooms = async ({
  talkRoomId,
}: {
  talkRoomId: number;
}) => {
  const credentials = await checkKeychain();
  return await axios.delete(
    `${baseUrl}/talkRooms/${talkRoomId}?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};

export const getRequestToTalkRooms = async ({id}: {id: string}) => {
  const credentials = await checkKeychain();
  return await axios.get<ResponseForGetTalkRoomData>(
    `${baseUrl}/users/${id}/talk_rooms?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};
