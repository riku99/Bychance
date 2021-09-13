import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {default as axios} from 'axios';
import {baseUrl} from '~/constants/url';

import {RootState} from '~/stores';
import {setExperiences} from '~/stores/experiences';
import {useApikit} from './apikit';

export const useToolTipAboutDisplayExperience = () => {
  const {dispatch, checkKeychain, addBearer, handleApiError} = useApikit();
  const displayedTooltip = useSelector(
    (state: RootState) =>
      state.settingsReducer.displayedToolTipAboutUserDisplay,
  );

  const changeisplayedTooltipAboutUserDisplay = useCallback(async () => {
    try {
      const credentials = await checkKeychain();
      await axios.put(
        `${baseUrl}/users/displayedToolTipAboutUserDisplayToUser?id=${credentials?.id}`,
        addBearer(credentials?.token),
      );
    } catch (e) {
      handleApiError(e);
    }
  }, [checkKeychain, addBearer, handleApiError]);

  return {
    displayedTooltip,
    changeisplayedTooltipAboutUserDisplay,
  };
};
