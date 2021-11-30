import {useCallback} from 'react';
import {useApikit} from '~/hooks/apikit';
import {postRequesutToRTCToken} from '~/apis/videoCalling';
import {PostRequestToRTCToken} from '~/apis/videoCalling/types';

export const useVideoCallingToken = () => {
  const {handleApiError} = useApikit();
  const createToken = useCallback(
    async (paylaod: PostRequestToRTCToken['payload']) => {
      try {
        const response = await postRequesutToRTCToken(paylaod);
        console.log(response.data.token);
        return response.data.token;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError],
  );

  return {
    createToken,
  };
};
