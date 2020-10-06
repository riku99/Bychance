import axios from 'axios';

import {UserType} from '../redux/user';
import {PostType} from '../redux/post';

const origin = 'http://localhost:80/api/v1';

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
  ({type: 'user'} & UserType & {posts: PostType[]}) | {type: 'loginError'}
> = async (token) => {
  const response = await axios.post(`${origin}/firstLogin`, {token: token});

  if (response.data.error) {
    return {type: 'loginError'};
  } else {
    return response.data;
  }
};

export const sendAccessToken: (
  accessToken: string,
) => Promise<
  ({type: 'user'} & UserType & {posts: PostType[]}) | {type: 'loginError'}
> = async (token) => {
  const response = await axios.post(
    `${origin}/subsequentLogin`,
    {},
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );

  if (response.data.error) {
    return {type: 'loginError'};
  } else {
    return response.data;
  }
};

export const sendEditedProfile = async ({
  name,
  introduce,
  image,
  token,
}: {
  name: string;
  introduce: string;
  image: string | undefined;
  token: string;
}): Promise<
  | ({type: 'user'} & UserType)
  | {type: 'invalid'; invalid: string}
  | {type: 'loginError'; error: string}
> => {
  const response = await axios.put(
    `${origin}/user`,
    {
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

  if (response.data.error) {
    return {type: 'loginError', ...response.data};
  }

  if (response.data.invalid) {
    return {type: 'invalid', ...response.data};
  }

  return response.data;
};
