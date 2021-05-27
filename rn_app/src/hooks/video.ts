import {useMemo} from 'react';

import {getThumbnailUrl} from '~/helpers/video';

export const useGetThumbnailUrl = (url: string) => {
  return useMemo(() => getThumbnailUrl(url), [url]);
};
