import axios from 'axios';

import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {Credentials} from '../helpers/keychain';

export const createRoom: ({
  id,
  token,
  recipientId,
}: Credentials & {recipientId: number}) => Promise<
  | {
      type: 'success';
      data: {id: number; presence: boolean; timestamp: string};
    }
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> = async ({id, token, recipientId}) => {
  try {
    const response = await axios.post<{
      presence: boolean;
      id: number;
      timestamp: string;
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
