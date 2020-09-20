import axios from 'axios';

import {userType} from '../redux/user';

const origin = 'http://localhost:80/api/v1';

export const sendIDtoken = async (token: string) => {
  const response = await axios.post(`${origin}/firstLogin`, {token: token});

  if (response.data.error) {
    throw new Error(response.data.error);
  } else {
    return response.data;
  }
};

export const sendAccessToken: (
  accessToken: string,
) => Promise<Object> | void = async (accessToken) => {
  const response = await axios.post(`${origin}/subsequentLogin`, {
    token: accessToken,
  });

  if (response.data.error) {
    throw new Error(response.data.error);
  } else {
    return response.data;
  }
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
  ({type: 'user'} & userType) | {type: 'invalid'; invalid: string}
> => {
  const response = await axios.put(`${origin}/user`, {
    name: name,
    introduce: introduce,
    token: token,
    image: image,
  });

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  if (response.data.invalid) {
    return {type: 'invalid', ...response.data};
  }

  return response.data;
};
