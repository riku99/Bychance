import axios from 'axios';

import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {credentials} from '../helpers/keychain';

export const createRoom: ({
  id,
  token,
  partnerId,
}: credentials & {partnerId: number}) => Promise<
  | {
      type: 'success';
      data: {id: number; presence: boolean};
    }
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> = async ({id, token, partnerId}) => {
  try {
    const response = await axios.post<{
      presence: boolean;
      room: number;
    }>(`${origin}/rooms`, {id, partner_id: partnerId}, headers(token));

    return {
      type: 'success',
      data: {id: response.data.room, presence: response.data.presence},
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
