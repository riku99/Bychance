import {axios, addBearer, baseUrl, getIdToken} from '../export';
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
  const idToken = await getIdToken();
  return await axios.post<ResponseForPostTalkRoomMessage>(
    `${baseUrl}/talk_rooms/${roomId}/messages`,
    {
      text,
      partnerId,
    },
    addBearer(idToken),
  );
};

export const postRequestToTalkRoomMessagesRead = async ({
  talkRoomId,
  ids,
}: {
  talkRoomId: number;
  ids: number[];
}) => {
  const idToken = await getIdToken();
  return await axios.post(
    `${baseUrl}/talk_rooms/${talkRoomId}/messages/read`,
    {
      ids,
    },
    addBearer(idToken),
  );
};

export const getRequestToTalkRoomMessages = async ({
  talkRoomId,
}: {
  talkRoomId: number;
}) => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetTalkRoomMessages>(
    `${baseUrl}/talk_rooms/${talkRoomId}/messages`,
    addBearer(idToken),
  );
};
