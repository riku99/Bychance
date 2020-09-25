import axios from 'axios';

import {origin} from '../constants/origin';
import {headers} from '../constants/headers';
import {createPostType} from '../actions/posts_action';
import {PostType} from '../redux/post';

export const sendPost = async (
  data: createPostType,
  token: string,
): Promise<
  | ({type: 'success'} & PostType)
  | {type: 'invalid'; invalid: string}
  | {type: 'loginError'}
  | {type: 'someError'}
> => {
  const response = await axios.post(`${origin}/post`, data, headers(token));

  if (response.data.loginError) {
    return {type: 'loginError'};
  }

  if (response.data.invalid) {
    return {type: 'invalid', invalid: response.data.invalid};
  }

  if (response.data.success) {
    const post = response.data;
    return {type: 'success', id: post.id, text: post.text, image: post.image};
  }

  return {type: 'someError'};
};
