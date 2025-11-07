import React, { useState } from 'react';
import moment from 'moment';
import Popup from 'reactjs-popup';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useSelector, useDispatch } from 'react-redux';
import { addEvent, editEvent, deleteEvent, setFilter } from '../redux/eventSlice';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/App.css';

const localizer = momentLocalizer(moment);

function App() {
  const dispatch = useDispatch();
  const { list: events, filter } = useSelector((state) => state.events);
  const [selectedDate, setSelectedDate] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editEventData, setEditEventData] = useState(null);
  const [eventData, setEventData] = useState({ title: '', location: '' });

  const handleSelectSlot = ({ start }) => {
    if (popupOpen) setPopupOpen(false);
    setSelectedDate(start);
    setEditEventData(null);
    setEventData({ title: '', location: '' });
    setTimeout(() => setPopupOpen(true), 100);
  };

  const handleSelectEvent = (event) => {
    if (popupOpen) setPopupOpen(false);
    setEditEventData(event);
    setEventData({ title: event.title, location: event.location });
    setTimeout(() => setPopupOpen(true), 100);
  };

  const handleSave = () => {
    if (eventData.title.trim() === '' || eventData.location.trim() === '') return;

    if (editEventData) {
      dispatch(editEvent({ ...editEventData, ...eventData }));
    } else {
      const newEvent = {
        id: Date.now(),
        title: eventData.title,
        location: eventData.location,
        start: selectedDate || new Date(),
        end: selectedDate || new Date(),
      };
      dispatch(addEvent(newEvent));
    }
    setTimeout(() => setPopupOpen(false), 200);
  };

  const handleDelete = () => {
    if (editEventData) {
      dispatch(deleteEvent(editEventData.id));
      setTimeout(() => setPopupOpen(false), 200);
    }
  };

  const filteredEvents = events.filter((event) => {
    const now = moment();
    const isPast = moment(event.start).isBefore(now, 'day');
    const isFuture = moment(event.start).isAfter(now, 'day');

    if (filter === 'past') return isPast;
    if (filter === 'upcoming') return isFuture;
    return true;
  });

  const eventStyleGetter = (event) => {
    const now = moment();
    const isPast = moment(event.start).isBefore(now, 'day');
    const style = {
      backgroundColor: isPast ? 'rgb(222, 105, 135)' : 'rgb(140, 189, 76)',
      borderRadius: '5px',
      color: 'white',
      border: 'none',
      padding: '2px 6px',
    };
    return { style };
  };

  return (
    <div className="App">
      <h1>Event Tracker Calendar</h1>

      {/* All 4 Buttons in same container for Cypress */}
      <div className="filter-buttons">
        <button className="btn" onClick={() => {
          if (popupOpen) setPopupOpen(false);
          setSelectedDate(new Date());
          setEditEventData(null);
          setEventData({ title: '', location: '' });
          setTimeout(() => setPopupOpen(true), 100);
        }}>Add Event</button>

        <button className="btn" onClick={() => dispatch(setFilter('all'))}>All</button>
        <button className="btn" onClick={() => dispatch(setFilter('past'))}>Past</button>
        <button className="btn" onClick={() => dispatch(setFilter('upcoming'))}>Upcoming</button>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />

      <Popup open={popupOpen} onClose={() => setPopupOpen(false)} closeOnDocumentClick>
        <div className="popup">
          <h2>{editEventData ? 'Edit Event' : 'Create Event'}</h2>
          <input
            placeholder="Event Title"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          />
          <input
            placeholder="Event Location"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
          />
          <div className="mm-popup__box__footer__right-space">
            <button className="mm-popup__btn" onClick={handleSave}>Save</button>
            {editEventData && (
              <>
                <button className="mm-popup__btn--info" onClick={handleSave}>Edit</button>
                <button className="mm-popup__btn--danger" onClick={handleDelete}>Delete</button>
              </>
            )}
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default App;
