import axios from 'axios';

import {origin} from '../constants/origin';
import {User} from '../redux/user';
import {Post} from '../redux/post';
import {Room} from '../redux/rooms';
import {MessageType} from '../redux/messages';
import {Flash} from '../redux/flashes';
import {headers} from '../helpers/headers';
import {Credentials} from '../helpers/keychain';

export type SuccessfullLoginData = {
  user: User;
  posts: Post[];
  rooms: Room[];
  messages: MessageType[];
  flashes: Flash[];
};

export const sampleLoginApi = async () => {
  const response = await axios.post(`${origin}/sample_login`);
  return response.data;
};

export const sendPosition: ({
  id,
  token,
  lat,
  lng,
}: Credentials & {
  lat: number | null;
  lng: number | null;
}) => Promise<
  | {type: 'success'}
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> = async ({id, token, lat, lng}) => {
  try {
    await axios.patch<{succless: boolean}>(
      `${origin}/user/position`,
      {id, lat, lng},
      headers(token),
    );

    return {type: 'success'};
  } catch (e) {
    if (e.response && e.response.data) {
      return {type: 'loginError'};
    } else {
      return {type: 'someError', message: e.message};
    }
  }
};

export const sendRequestToChangeDisplay: ({
  display,
  id,
  token,
}: {display: boolean} & Credentials) => Promise<
  | {type: 'success'}
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> = async ({display, id, token}) => {
  try {
    await axios.patch(`${origin}/user/display`, {id, display}, headers(token));

    return {type: 'success'};
  } catch (e) {
    if (e.response && e.response.data.loginError) {
      return {type: 'loginError'};
    } else {
      return {type: 'someError', message: e.message};
    }
  }
};
