import {addBearer, axios, baseUrl, checkKeychain} from '../export';
import {
  ResponseForPostTalkRoomMessage,
  ResponseForGetTalkRoomMessages,
} from './types';

export const postRequestToTalkRoomMessages = async ({
  roomId,
  partnerId,
  text,
}: {
  roomId: number;
  partnerId: string;
  text: string;
}) => {
  const credentials = await checkKeychain();
  return await axios.post<ResponseForPostTalkRoomMessage>(
    `${baseUrl}/talk_rooms/${roomId}/messages?id=${credentials?.id}`,
    {
      text,
      partnerId,
    },
    addBearer(credentials?.token),
  );
};

export const postRequestToTalkRoomMessagesRead = async ({
  talkRoomId,
  ids,
}: {
  talkRoomId: number;
  ids: number[];
}) => {
  const credentials = await checkKeychain();
  return await axios.post(
    `${baseUrl}/talk_rooms/${talkRoomId}/messages/read?id=${credentials?.id}`,
    {
      ids,
    },
    addBearer(credentials?.token),
  );
};

export const getRequestToTalkRoomMessages = async ({
  talkRoomId,
}: {
  talkRoomId: number;
}) => {
  const credentials = await checkKeychain();
  return await axios.get<ResponseForGetTalkRoomMessages>(
    `${baseUrl}/talk_rooms/${talkRoomId}/messages?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};
