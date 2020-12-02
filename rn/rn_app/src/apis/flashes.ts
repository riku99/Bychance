import axios, {AxiosError} from 'axios';

import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {Credentials} from '../helpers/keychain';
import {Flash} from '../redux/flashes';

export const createFlash = async ({
  id,
  token,
  content,
  contentType,
  ext,
}: Credentials & {
  content: string;
  contentType: 'image' | 'video';
  ext: string | null;
}): Promise<
  | {type: 'success'; data: Flash}
  | {type: 'loginError'}
  | {type: 'invalidError'; message: string}
  | {type: 'someError'; message: string}
> => {
  try {
    const response = await axios.post<Flash>(
      `${origin}/flashes`,
      {id, content, contentType, ext},
      headers(token),
    );

    return {type: 'success', data: response.data};
  } catch (e) {
    if (e && e.response) {
      const axiosError = e as AxiosError<
        {errorType: 'loginError'} | {errorType: 'invalidError'; message: string}
      >;
      if (axiosError.response?.data.errorType === 'loginError') {
        return {type: 'loginError'};
      } else if (axiosError.response?.data.errorType === 'invalidError') {
        return {
          type: 'invalidError',
          message: axiosError.response.data.message,
        };
      } else {
        return {type: 'someError', message: '予期せぬエラー'};
      }
    } else {
      return {type: 'someError', message: e.message};
    }
  }
};
