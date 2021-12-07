import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type Experiences = {
  tooltipAboutDisplay: boolean;
  intro: boolean;
  videoEditDescription: boolean;
  descriptionOfVideoCallingSettings: boolean;
  descriptionOfNotGettingTalkRoomMessageShowed: boolean;
  descriptionOfMyDisplayShowed: boolean;
};

const initialState: Experiences = {
  tooltipAboutDisplay: false,
  videoEditDescription: false,
  intro: false,
  descriptionOfVideoCallingSettings: false, // 「ビデオ通話は相手が受け取らない設定にしてるかも」の説明を表示したかどうか
  descriptionOfNotGettingTalkRoomMessageShowed: false,
  descriptionOfMyDisplayShowed: false,
};

const experiencesSlice = createSlice({
  name: 'experiences',
  initialState,
  reducers: {
    setExperiences: (state, action: PayloadAction<Partial<Experiences>>) => ({
      ...state,
      ...action.payload,
    }),
    resetExperiences: () => initialState,
  },
});

export const experiencesReducer = experiencesSlice.reducer;

export const {setExperiences, resetExperiences} = experiencesSlice.actions;
