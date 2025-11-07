import { configureStore, createSlice } from "@reduxjs/toolkit";

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    filter: "all",
  },
  reducers: {
    addEvent: (state, action) => {
      state.events.push({ id: Date.now(), ...action.payload });
    },
    editEvent: (state, action) => {
      state.events = state.events.map((event) =>
        event.id === action.payload.id ? action.payload : event
      );
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter((e) => e.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { addEvent, editEvent, deleteEvent, setFilter } = eventsSlice.actions;
export default configureStore({ reducer: eventsSlice.reducer });
