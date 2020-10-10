import axios from 'axios';

import {origin} from '../constants/origin';
import {headers} from '../constants/headers';
import {PostType} from '../redux/post';

export const sendPost: ({
  text,
  image,
}: {
  text: string;
  image: string;
  user: number;
  token: string;
}) => Promise<
  | ({type: 'success'} & PostType)
  | {type: 'invalid'; invalid: string}
  | {type: 'loginError'}
> = async ({text, image, user, token}) => {
  const response = await axios.post(
    `${origin}/post`,
    {post: {text, image, user}},
    headers(token),
  );

  if (response.data.success) {
    return {type: 'success', ...response.data.success};
  }

  if (response.data.loginError) {
    return {type: 'loginError', invalid: response.data.invalid};
  }

  if (response.data.invalid) {
    return {type: 'invalid', invalid: response.data.invalid};
  }
};

export const deletePost: ({
  id,
  user,
  token,
}: {
  id: number;
  user: number;
  token: string;
}) => Promise<
  {type: 'success'} | {type: 'loginError'} | {type: 'invalid'; invalid: string}
> = async ({id, user, token}) => {
  const response = await axios.request({
    method: 'delete',
    url: `${origin}/post`,
    data: {post: {id, user}},
    ...headers(token),
  });

  if (response.data.success) {
    return {type: 'success'};
  }

  if (response.data.loginError) {
    return {type: 'loginError'};
  }

  if (response.data.invalid) {
    return {type: 'invalid', invalid: response.data.invalid};
  }

  throw new Error();
};
