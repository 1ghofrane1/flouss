import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const AppCalendar = ({ events }) => {
  const eventStyleGetter = (event) => {
    let backgroundColor = event.income > 0 ? '#1BC' : '#B03052'; // Green for income, red for expense
    return {
      style: {
        backgroundColor: backgroundColor,
        color: '#fff',
        borderRadius: '5px',
        padding: '5px',
        fontWeight: 'bold',
      },
    };
  };

  return (
    <div className="calendar-container">
      <h1>My Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events} // Accept events prop
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};


export default AppCalendar;