import axios from 'axios';

import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {Post} from '../redux/posts';
import {Credentials} from '../helpers/keychain';

export const sendPost: ({
  text,
  image,
  id,
  token,
}: {
  text: string;
  image: string;
} & Credentials) => Promise<
  | {type: 'success'; data: Post}
  | {type: 'invalid'; invalid: string}
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> = async ({text, image, id, token}) => {
  try {
    const response = await axios.post<Post>(
      `${origin}/post`,
      {text, image, id},
      headers(token),
    );

    return {type: 'success', data: response.data};
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

export const deletePost: ({
  postId,
  id,
  token,
}: {
  postId: number;
} & Credentials) => Promise<
  | {type: 'success'}
  | {type: 'loginError'}
  | {type: 'invalid'; invalid: string}
  | {type: 'someError'; message: string}
> = async ({postId, id, token}) => {
  try {
    await axios.request<{success: true}>({
      method: 'delete',
      url: `${origin}/post`,
      data: {id, postId},
      ...headers(token),
    });

    return {type: 'success'};
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
