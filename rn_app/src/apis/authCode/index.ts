import {axios, baseUrl} from '../export';

export const postRequestToUserAuthCode = async (email: string) => {
  return await axios.post(`${baseUrl}/user_auth_code`, {
    email,
  });
};
