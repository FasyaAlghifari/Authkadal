import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const API_KEY = 'AIzaSyB_rQU5IOIZw2-crhzlYpUeoBZYwEav6AU';
const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get('http://localhost:8080/events');
      setEvents(response.data);
    };

    fetchEvents();
  }, []);

  const handleDateClick = async (selected) => {
    const title = prompt("Please enter a new title for your event");
    if (title) {
      const newEvent = {
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      };
      const response = await axios.post('http://localhost:8080/events', newEvent);
      setEvents([...events, response.data]);
    }
  };

  const handleEventClick = async (selected) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
      await axios.delete(`http://localhost:8080/events/${selected.event.id}`);
      setEvents(events.filter(event => event.id !== selected.event.id));
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        events={events}
        select={handleDateClick}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default Calendar;
