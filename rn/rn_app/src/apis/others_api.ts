import axios from 'axios';

import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {OtherUserType} from '../redux/others';

type resultApi = Promise<
  {type: 'success'; others: OtherUserType[]} | {type: 'loginError'}
>;

type credentials = {id: number; token: string};

export const getOthers: ({id, token}: credentials) => resultApi = async ({
  id,
  token,
}) => {
  const response = await axios.get(`${origin}/others`, {
    params: {id: id},
    ...headers(token),
  });

  if (response.data.success) {
    return {type: 'success', others: response.data.success.others};
  }

  if (response.data.loginError) {
    return {type: 'loginError'};
  }

  throw new Error();
};
