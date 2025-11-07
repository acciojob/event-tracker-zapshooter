export const addEvent = (event) => ({
  type: "ADD_EVENT",
  payload: event,
});

export const editEvent = (event) => ({
  type: "EDIT_EVENT",
  payload: event,
});

export const deleteEvent = (id) => ({
  type: "DELETE_EVENT",
  payload: id,
});

export const setFilter = (filter) => ({
  type: "SET_FILTER",
  payload: filter,
});
