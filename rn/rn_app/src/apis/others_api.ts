import axios from 'axios';

import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {OtherUserType} from '../redux/others';
import {credentials} from '../helpers/keychain';

export const getOthers: ({
  id,
  token,
}: credentials) => Promise<
  | {type: 'success'; data: OtherUserType[]}
  | {type: 'loginError'}
  | {type: 'someError'; message: string}
> = async ({id, token}) => {
  try {
    const response = await axios.get<OtherUserType[]>(`${origin}/others`, {
      params: {id},
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
