import axios, {AxiosError} from 'axios';

import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {Credentials} from '../helpers/keychain';

import {MessageType} from '../redux/messages';

export const createMessage = async ({
  id,
  token,
  roomId,
  userId,
  text,
}: Credentials & {roomId: number; userId: number; text: string}): Promise<
  | {
      type: 'success';
      data: MessageType;
    }
  | {type: 'loginError'}
  | {type: 'invalidError'; message: string}
  | {type: 'someError'; message: string}
> => {
  try {
    const response = await axios.post<MessageType>(
      `${origin}/messages`,
      {
        room_id: roomId,
        user_id: userId,
        text,
        id,
      },
      headers(token),
    );

    return {type: 'success', data: response.data};
  } catch (e) {
    if (e && e.response) {
      const axiosError = e as AxiosError<
        {errorType: 'loginError'} | {errorType: 'invalidError'; message: string}
      >;
      if (axiosError.response?.data.errorType === 'loginError') {
        return {type: 'loginError'};
      } else if (axiosError.response?.data.errorType === 'invalidError') {
        return {
          type: 'invalidError',
          message: axiosError.response.data.message,
        };
      } else {
        throw e;
      }
    } else {
      return {type: 'someError', message: e.message};
    }
  }
};

export const changeMessagesRead = async ({
  token,
  id,
  messageIds,
}: Credentials & {messageIds: number[]}): Promise<
  | {
      type: 'success';
      data: MessageType[];
    }
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> => {
  try {
    const response = axios.patch<MessageType[]>(
      `${origin}/messages_read`,
      {
        id,
        message_ids: messageIds,
      },
      headers(token),
    );

    return {type: 'success', data: (await response).data};
  } catch (e) {
    if (e && e.response) {
      const axiosError = e as AxiosError<{errorType: 'loginError'}>;
      if (axiosError.response?.data) {
        return {type: 'loginError'};
      }
      throw e;
    } else {
      return {type: 'someError', message: e.message};
    }
  }
};
