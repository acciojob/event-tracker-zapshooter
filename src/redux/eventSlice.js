import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    list: [],
    filter: 'all',
  },
  reducers: {
    addEvent: (state, action) => {
      state.list.push(action.payload);
    },
    editEvent: (state, action) => {
      const index = state.list.findIndex(ev => ev.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
      }
    },
    deleteEvent: (state, action) => {
      state.list = state.list.filter(ev => ev.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { addEvent, editEvent, deleteEvent, setFilter } = eventSlice.actions;
export default eventSlice.reducer;
