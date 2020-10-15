import axios from 'axios';

import {origin} from '../constants/origin';
import {UserType} from '../redux/user';
import {PostType} from '../redux/post';
import {headers} from '../helpers/headers';
import {credentials} from '../helpers/keychain';

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

export const sendIDtoken: (
  token: string,
) => Promise<
  | {
      type: 'success';
      user: UserType;
      posts: PostType[];
      token: string;
    }
  | {type: 'loginError'}
> = async (token) => {
  const response = await axios.post(`${origin}/firstLogin`, {}, headers(token));

  if (response.data.loginError) {
    return {type: 'loginError'};
  } else {
    return {type: 'success', ...response.data};
  }
};

export const sendAccessToken: ({
  id,
  token,
}: credentials) => Promise<
  {type: 'success'; user: UserType; posts: PostType[]} | {type: 'loginError'}
> = async ({id, token}) => {
  const response = await axios.post(
    `${origin}/subsequentLogin`,
    {id: id},
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );

  if (response.data.success) {
    return {type: 'success', ...response.data.success.user};
  }

  if (response.data.loginError) {
    return {type: 'loginError'};
  }
};

export const sendEditedProfile: ({
  name,
  introduce,
  image,
  id,
  token,
}: {
  name: string;
  introduce: string;
  image: string | undefined;
  id: number;
  token: string;
}) => Promise<
  | {type: 'user' & UserType}
  | {type: 'invalid'; invalid: string}
  | {type: 'loginError'}
> = async ({name, introduce, image, id, token}) => {
  const response = await axios.put(
    `${origin}/user`,
    {
      id: id,
      name: name,
      introduce: introduce,
      image: image,
    },
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );

  if (response.data.success) {
    return {type: 'user', ...response.data.success};
  }

  if (response.data.loginError) {
    return {type: 'loginError'};
  }

  if (response.data.invalid) {
    return {type: 'invalid', ...response.data};
  }
};
