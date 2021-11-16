import {axios, addBearer, baseUrl, getIdToken} from '../export';

import {LoginData} from './types';

export const postRequestToLineLogin = async ({idToken}: {idToken: string}) => {
  return await axios.post<LoginData & {accessToken: string}>(
    `${baseUrl}/sessions/line_login`,
    {},
    addBearer(idToken),
  );
};

export const getRequestToLoginData = async () => {
  const idToken = await getIdToken();
  return await axios.get<LoginData>(
    `${baseUrl}/sessions/login_data`,
    addBearer(idToken),
  );
};

export const deleteRequestToSessions = async () => {
  const idToken = await getIdToken();
  return await axios.delete(`${baseUrl}/sessions`, addBearer(idToken));
};
