import {useMemo} from 'react';
import {removeExtention} from '~/utils';

export const useGetThumbnailUrl = (url: string) => {
  return useMemo(() => {
    const urlwithoutExt = removeExtention(url);
    return `${urlwithoutExt}_thumbnail.webp`;
  }, [url]);
};
