import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Experiences} from '~/types/store/experiences';

const initialState: Experiences = {
  tooltipAboutDisplay: false,
  videoEditDescription: false,
  intro: false,
};

const experiencesSlice = createSlice({
  name: 'experiences',
  initialState,
  reducers: {
    setExperiences: (state, action: PayloadAction<Partial<Experiences>>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const experiencesReducer = experiencesSlice.reducer;

export const {setExperiences} = experiencesSlice.actions;
