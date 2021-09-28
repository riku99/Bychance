import {useCallback, useEffect, useState} from 'react';

import {useApikit} from './apikit';
import {
  postRequestToGroups,
  getRequestToGroups,
  deleteRequestToGroups,
} from '~/apis/groups';
import {ResponseForGetGroups} from '~/apis/groups/types';
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

export const useGropuData = (userId: string) => {
  const {handleApiError} = useApikit();
  const [groupData, setGroupData] = useState<ResponseForGetGroups>();
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    const response = await getRequestToGroups(userId);
    setGroupData(response.data);
  }, [userId]);

  useEffect(() => {
    try {
      (async function () {
        await fetch();
      })();
    } catch (e) {
      handleApiError(e);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError, fetch]);

  return {
    groupData,
    setGroupData,
    isLoading,
    fetch,
  };
};

export const useDeleteGroup = () => {
  const {handleApiError, setToastLoading} = useApikit();

  const deleteGroup = useCallback(async () => {
    setToastLoading(true);
    try {
      await deleteRequestToGroups();
      return true;
    } catch (e) {
      handleApiError(e);
    } finally {
      setToastLoading(false);
    }
  }, [handleApiError, setToastLoading]);

  return {
    deleteGroup,
  };
};
