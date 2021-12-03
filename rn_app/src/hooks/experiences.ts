import {useCallback} from 'react';
import {useSelector} from 'react-redux';

import {RootState} from '~/stores';
import {setExperiences} from '~/stores/experiences';
import {useApikit} from './apikit';
import {
  putRequestToIntro,
  putRequestToTooltipAboutDisplayExperience,
  putRequestToVideoEditDescription,
  putRequestToDescriptionOfVideoCallingSettingsShowed,
} from '~/apis/experiences';

export const useTooltipAboutDisplayExperience = () => {
  const {dispatch, handleApiError} = useApikit();
  const alreadyShowedTooltip = useSelector(
    (state: RootState) => state.experiencesReducer.tooltipAboutDisplay,
  );

  const changeTooltipData = useCallback(
    async (value: boolean) => {
      try {
        await putRequestToTooltipAboutDisplayExperience(value);

        dispatch(setExperiences({tooltipAboutDisplay: value}));
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, dispatch],
  );

  return {
    alreadyShowedTooltip,
    changeTooltipData,
  };
};

export const useVideoEditDescription = () => {
  const {dispatch, handleApiError} = useApikit();
  const currentVideoEditDesctiption = useSelector(
    (state: RootState) => state.experiencesReducer.videoEditDescription,
  );
  const setVideoEditDesciption = useCallback(
    (v: boolean) => {
      dispatch(setExperiences({videoEditDescription: v}));
    },
    [dispatch],
  );

  const changeVideoEditDescription = useCallback(
    async (bool: boolean) => {
      try {
        await putRequestToVideoEditDescription(bool);

        setVideoEditDesciption(bool);
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, setVideoEditDesciption],
  );

  return {
    currentVideoEditDesctiption,
    changeVideoEditDescription,
    setVideoEditDesciption,
  };
};

export const useIntro = () => {
  const {dispatch, handleApiError} = useApikit();
  const endOfIntro = useSelector(
    (state: RootState) => state.experiencesReducer.intro,
  );
  const setIntro = useCallback(
    (v: boolean) => {
      dispatch(setExperiences({intro: v}));
    },
    [dispatch],
  );
  const changeIntro = useCallback(
    async (v: boolean) => {
      try {
        await putRequestToIntro(v);
        setIntro(v);
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, setIntro],
  );

  return {
    endOfIntro,
    setIntro,
    changeIntro,
  };
};

export const useDescriptionOfVideoCallingSettings = () => {
  const {dispatch} = useApikit();
  const descriptionOfVideoCallingSettings = useSelector(
    (state: RootState) =>
      state.experiencesReducer.descriptionOfVideoCallingSettings,
  );
  const setDescriptionOfVideoCallingSettings = useCallback(
    (v: boolean) => {
      dispatch(setExperiences({descriptionOfVideoCallingSettings: v}));
    },
    [dispatch],
  );
  const changeDescriptionOfVideoCallingSettings = useCallback(
    async (v: boolean) => {
      try {
        await putRequestToDescriptionOfVideoCallingSettingsShowed(v);
      } catch (e) {}
    },
    [],
  );

  return {
    descriptionOfVideoCallingSettings,
    setDescriptionOfVideoCallingSettings,
    changeDescriptionOfVideoCallingSettings,
  };
};
