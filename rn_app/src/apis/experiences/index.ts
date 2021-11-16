import {axios, addBearer, baseUrl, getIdToken} from '../export';

export const putRequestToTooltipAboutDisplayExperience = async (
  value: boolean,
) => {
  const idToken = await getIdToken();
  return await axios.put(
    `${baseUrl}/users/tooltip_of_user_display_showed`,
    {value},
    addBearer(idToken),
  );
};

export const putRequestToVideoEditDescription = async (value: boolean) => {
  const idToken = await getIdToken();
  return await axios.put(
    `${baseUrl}/users/videoEditDescription`,
    {videoEditDescription: value},
    addBearer(idToken),
  );
};

export const putRequestToIntro = async (value: boolean) => {
  const idToken = await getIdToken();
  return await axios.put(
    `${baseUrl}/users/intro`,
    {intro: value},
    addBearer(idToken),
  );
};
