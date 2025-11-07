import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { setFilter, addEvent, editEvent, deleteEvent } from "./redux/actions";

const localizer = momentLocalizer(moment);

export default function App() {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);
  const filter = useSelector((state) => state.filter);

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventData, setEventData] = useState({ title: "", location: "" });
  const [editEventData, setEditEventData] = useState(null);

  const filteredEvents =
    filter === "all"
      ? events
      : filter === "past"
      ? events.filter((event) => new Date(event.start) < new Date())
      : events.filter((event) => new Date(event.start) >= new Date());

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setEventData({ title: "", location: "" });
    setEditEventData(null);
    setTimeout(() => setPopupOpen(true), 100);
  };

  const handleSelectEvent = (event) => {
    setEditEventData(event);
    setEventData({ title: event.title, location: event.location });
    setTimeout(() => setPopupOpen(true), 100);
  };

  const handleSaveEvent = () => {
    if (editEventData) {
      dispatch(editEvent({ ...editEventData, ...eventData }));
    } else {
      dispatch(addEvent({ ...eventData, start: selectedDate, end: selectedDate }));
    }
    setPopupOpen(false);
  };

  const handleDeleteEvent = () => {
    dispatch(deleteEvent(editEventData.id));
    setPopupOpen(false);
  };

  const eventPropGetter = () => ({
    style: {
      backgroundColor: "#ff69b4",
      borderRadius: "8px",
      color: "white",
      border: "none",
    },
  });

  return (
    <div className="App">
      {/* === Four Buttons === */}
      <div>
        <button
          className="btn"
          onClick={() => {
            if (popupOpen) setPopupOpen(false);
            setSelectedDate(new Date());
            setEditEventData(null);
            setEventData({ title: "", location: "" });
            setTimeout(() => setPopupOpen(true), 100);
          }}
        >
          Add Event
        </button>
      </div>

      <div>
        <button className="btn" onClick={() => dispatch(setFilter("all"))}>
          All
        </button>
      </div>

      <div>
        <button className="btn" onClick={() => dispatch(setFilter("past"))}>
          Past
        </button>
      </div>

      <div>
        <button className="btn" onClick={() => dispatch(setFilter("upcoming"))}>
          Upcoming
        </button>
      </div>

      {/* === Calendar === */}
      <h1 style={{ marginTop: "30px" }}>Event Tracker Calendar</h1>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        eventPropGetter={eventPropGetter}
      />

      {/* === Popup Modal === */}
      <Popup open={popupOpen} onClose={() => setPopupOpen(false)} position="right center">
        <div style={{ padding: "10px", background: "white", borderRadius: "10px" }}>
          <h3>{editEventData ? "Edit Event" : "Create Event"}</h3>
          <input
            placeholder="Event Title"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <input
            placeholder="Event Location"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <div className="mm-popup__box__footer__right-space">
            <button className="mm-popup__btn" onClick={handleSaveEvent}>
              Save
            </button>
          </div>
          {editEventData && (
            <>
              <button className="mm-popup__btn--info" onClick={handleSaveEvent}>
                Edit
              </button>
              <button className="mm-popup__btn--danger" onClick={handleDeleteEvent}>
                Delete
              </button>
            </>
          )}
        </div>
      </Popup>
    </div>
  );
}
