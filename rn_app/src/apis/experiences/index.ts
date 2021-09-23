import {axios, addBearer, checkKeychain, baseUrl} from '../export';

export const putRequestToTooltipAboutDisplayExperience = async (
  value: boolean,
) => {
  const credentials = await checkKeychain();
  return await axios.put(
    `${baseUrl}/users/tooltip_of_user_display_showed?id=${credentials?.id}`,
    {value},
    addBearer(credentials?.token),
  );
};

export const putRequestToVideoEditDescription = async (value: boolean) => {
  const credentials = await checkKeychain();
  return await axios.put(
    `${baseUrl}/users/videoEditDescription?id=${credentials?.id}`,
    {videoEditDescription: value},
    addBearer(credentials?.token),
  );
};

export const putRequestToIntro = async (value: boolean) => {
  const credentials = await checkKeychain();
  return await axios.put(
    `${baseUrl}/users/intro?id=${credentials?.id}`,
    {intro: value},
    addBearer(credentials?.token),
  );
};
