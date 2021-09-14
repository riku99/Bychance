import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {default as axios} from 'axios';
import {baseUrl} from '~/constants/url';

import {RootState} from '~/stores';
import {setExperiences} from '~/stores/experiences';
import {useApikit} from './apikit';

export const useTooltipAboutDisplayExperience = () => {
  const {dispatch, checkKeychain, addBearer, handleApiError} = useApikit();
  const alreadyShowedTooltip = useSelector(
    (state: RootState) => state.experiencesReducer.tooltipAboutDisplay,
  );

  const changeTooltipData = useCallback(
    async (value: boolean) => {
      try {
        const credentials = await checkKeychain();
        await axios.put(
          `${baseUrl}/users/tooltip_of_user_display_showed?id=${credentials?.id}`,
          {value},
          addBearer(credentials?.token),
        );

        dispatch(setExperiences({tooltipAboutDisplay: value}));
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, dispatch],
  );

  return {
    alreadyShowedTooltip,
    changeTooltipData,
  };
};
