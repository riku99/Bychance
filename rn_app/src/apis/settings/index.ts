import {axios, addBearer, baseUrl, getIdToken} from '../export';

export const putRequestToUsersGroupsApplicationEnabled = async (
  value: boolean,
) => {
  const idToken = await getIdToken();
  return await axios.put<String>(
    `${baseUrl}/users/groups_application_enabled`,
    {value},
    addBearer(idToken),
  );
};

export const putRequestToDisplay = async (value: boolean) => {
  const idToken = await getIdToken();
  return await axios.put(
    `${baseUrl}/users/display`,
    {display: value},
    addBearer(idToken),
  );
};

export const putRequestToTalkRoomMessagesReceipt = async (value: boolean) => {
  const idToken = await getIdToken();
  return await axios.put(
    `${baseUrl}/users/talk_room_messages_receipt`,
    {receipt: value},
    addBearer(idToken),
  );
};

export const putRequestToShowReceiveMessage = async (value: boolean) => {
  const idToken = await getIdToken();
  return await axios.put(
    `${baseUrl}/users/show_receive_message`,
    {showReceiveMessage: value},
    addBearer(idToken),
  );
};

export const putRequestToVideoCallingEnabled = async (value: boolean) => {
  const idToken = await getIdToken();
  return await axios.put(
    `${baseUrl}/users/video_calling_enabled`,
    {value},
    addBearer(idToken),
  );
};
