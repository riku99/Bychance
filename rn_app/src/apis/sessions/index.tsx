import {addBearer, axios, baseUrl, checkKeychain} from '../export';

import {LoginData} from './types';

export const postRequestToLineLogin = async ({idToken}: {idToken: string}) => {
  return await axios.post<LoginData & {accessToken: string}>(
    `${baseUrl}/sessions/line_login`,
    {},
    addBearer(idToken),
  );
};

export const getRequestToLoginData = async () => {
  const credentials = await checkKeychain();
  return await axios.get<LoginData>(
    `${baseUrl}/login_data?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};
