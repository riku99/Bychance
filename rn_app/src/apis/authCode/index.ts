import {axios, baseUrl} from '../export';

export const postRequestToUserAuthCode = async (email: string) => {
  return await axios.post(`${baseUrl}/user_auth_code`, {
    email,
  });
};

export const getRequestToUserAuthCode = async (code: string) => {
  return await axios.get(`${baseUrl}/user_auth_code/verify?code=${code}`);
};
