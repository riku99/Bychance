import {removeExtention} from '~/utils';

export const getThumbnailUrl = (url: string) => {
  const urlwithoutExt = removeExtention(url);
  return `${urlwithoutExt}_thumbnail.webp`;
};
