import {addBearer} from '~/helpers/requestHeaders';
import {checkKeychain} from '~/helpers/credentials';
import {default as axios} from 'axios';

import {baseUrl} from '~/constants/url';

export const putRequestToUsersGroupsApplicationEnabled = async (
  value: boolean,
) => {
  const credentials = await checkKeychain();
  return await axios.put<String>(
    `${baseUrl}/users/groups_application_enabled?id=${credentials?.id}`,
    {value},
    addBearer(credentials?.token),
  );
};

export const putRequestToDisplay = async (value: boolean) => {
  const credentials = await checkKeychain();
  return await axios.put(
    `${baseUrl}/users/display?id=${credentials?.id}`,
    {display: value},
    addBearer(credentials?.token),
  );
};

export const putRequestToTalkRoomMessagesReceipt = async (value: boolean) => {
  const credentials = await checkKeychain();
  return await axios.put(
    `${baseUrl}/users/talk_room_messages_receipt?id=${credentials?.id}`,
    {receipt: value},
    addBearer(credentials?.token),
  );
};

export const putRequestToShowReceiveMessage = async (value: boolean) => {
  const credentials = await checkKeychain();
  return await axios.put(
    `${baseUrl}/users/show_receive_message?id=${credentials?.id}`,
    {showReceiveMessage: value},
    addBearer(credentials?.token),
  );
};
