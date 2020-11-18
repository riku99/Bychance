import axios from 'axios';

import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {anotherUser} from '../redux/others';
import {Credentials} from '../helpers/keychain';

export const getOthers: ({
  id,
  token,
  lat,
  lng,
  range,
}: Credentials & {
  lat: number | null;
  lng: number | null;
  range: number;
}) => Promise<
  | {type: 'success'; data: anotherUser[]}
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> = async ({id, token, lat, lng, range}) => {
  try {
    const response = await axios.get<anotherUser[]>(`${origin}/others`, {
      params: {id, lat, lng, range},
      ...headers(token),
    });

    return {type: 'success', data: response.data};
  } catch (e) {
    if (e.response && e.response.data.loginError) {
      return {type: 'loginError'};
    } else {
      return {type: 'someError', message: e.message};
    }
  }
};
