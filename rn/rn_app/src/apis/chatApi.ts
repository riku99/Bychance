import axios, {AxiosError} from 'axios';

import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {credentials} from '../helpers/keychain';
import {MessageType} from '../redux/chat';

export const createRoom: ({
  id,
  token,
  recipientId,
}: credentials & {recipientId: number}) => Promise<
  | {
      type: 'success';
      data: {id: number; presence: boolean};
    }
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> = async ({id, token, recipientId}) => {
  try {
    const response = await axios.post<{
      presence: boolean;
      id: number;
    }>(`${origin}/rooms`, {id, recipient_id: recipientId}, headers(token));

    return {
      type: 'success',
      data: response.data,
    };
  } catch (e) {
    if (e && e.response) {
      //const axiosError = e as AxiosError<{loginError: boolean}>;
      return {type: 'loginError'};
    } else {
      return {type: 'someError', message: e.message};
    }
  }
};

export const createMessage = async ({
  id,
  token,
  roomId,
  userId,
  text,
}: credentials & {roomId: number; userId: number; text: string}): Promise<
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
