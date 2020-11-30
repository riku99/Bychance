import axios from 'axios';

import {origin} from '../constants/origin';
import {UserType} from '../redux/user';
import {Post} from '../redux/post';
import {Room} from '../redux/rooms';
import {MessageType} from '../redux/messages';
import {Flash} from '../redux/flashes';
import {headers} from '../helpers/headers';
import {Credentials} from '../helpers/keychain';

export type SuccessfullLoginData = {
  user: UserType;
  posts: Post[];
  rooms: Room[];
  messages: MessageType[];
  flashes: Flash[];
};

export const sendNonce: (
  nonce: string,
) => Promise<boolean | undefined> = async (nonce) => {
  const response = await axios.post(`${origin}/nonce`, {nonce: nonce});

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  if (response.data.nonce) {
    return response.data.nonce;
  }
};

export const sampleLoginApi = async () => {
  const response = await axios.post(`${origin}/sample_login`);
  console.log(response.data);
  return response.data;
};

export const sendIDtoken: ({
  token,
  lat,
  lng,
}: {
  token: string;
  lat: number | null;
  lng: number | null;
}) => Promise<
  | {
      type: 'success';
      data: SuccessfullLoginData & {token: string};
    }
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> = async ({token, lat, lng}) => {
  try {
    const response = await axios.post<SuccessfullLoginData & {token: string}>(
      `${origin}/first_login`,
      {lat, lng},
      headers(token),
    );

    return {
      type: 'success',
      data: response.data,
    };
  } catch (e) {
    if (e.response && e.response.data.loginError) {
      return {type: 'loginError'};
    } else {
      return {type: 'someError', message: e.message};
    }
  }
};

export const sendAccessToken: ({
  id,
  token,
}: Credentials) => Promise<
  | {
      type: 'success';
      data: {
        user: UserType;
        posts: Post[];
        rooms: Room[];
        messages: MessageType[];
      };
    }
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> = async ({id, token}) => {
  try {
    const response = await axios.post<SuccessfullLoginData>(
      `${origin}/subsequent_login`,
      {id: id},
      headers(token),
    );

    return {type: 'success', data: response.data};
  } catch (e) {
    if (e.response && e.response.data.loginError) {
      return {type: 'loginError'};
    } else {
      return {type: 'someError', message: e.message};
    }
  }
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

export const sendEditedProfile: ({
  name,
  introduce,
  image,
  message,
  id,
  token,
}: {
  name: string;
  introduce: string;
  image: string | undefined;
  message: string;
  id: number;
  token: string;
}) => Promise<
  | {type: 'success'; user: UserType}
  | {type: 'invalid'; invalid: string}
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> = async ({name, introduce, image, message, id, token}) => {
  try {
    const response = await axios.patch<UserType>(
      `${origin}/user`,
      {
        id,
        name,
        introduce,
        image,
        message,
      },
      headers(token),
    );

    return {type: 'success', user: response.data};
  } catch (e) {
    if (e.response && e.response.data.loginError) {
      return {type: 'loginError'};
    } else if (e.response && e.response.data.invalid) {
      return {type: 'invalid', invalid: e.response.data.invalid};
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
