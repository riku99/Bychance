import {useCallback} from 'react';

import {useApikit} from './apikit';
import {postRequestToGroups} from '~/apis/groups';
import {useToastLoading} from './appState';

export const useJoinGroup = () => {
  const {handleApiError, toast} = useApikit();
  const {setToastLoading} = useToastLoading();
  const join = useCallback(
    async ({ownerId}: {ownerId: string}) => {
      try {
        setToastLoading(true);
        const response = await postRequestToGroups({ownerId});
        toast?.show('参加しました', {type: 'success'});
        return response.data;
      } catch (e) {
        handleApiError(e);
      } finally {
        setToastLoading(false);
      }
    },
    [handleApiError, toast, setToastLoading],
  );

  return {
    join,
  };
};
