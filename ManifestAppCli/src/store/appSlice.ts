import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type AppState = {
  ready: boolean;
};

const initialState: AppState = {
  ready: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setReady(state, action: PayloadAction<boolean>) {
      state.ready = action.payload;
    },
  },
});

export const {setReady} = appSlice.actions;
export default appSlice.reducer;
