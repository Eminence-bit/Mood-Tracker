import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { MoodEntry, moodColors, moodDescriptions } from '../types/mood';

interface CalendarViewProps {
  moodEntries: MoodEntry[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ moodEntries }) => {
  const events = moodEntries.map((entry) => ({
    title: entry.mood,
    date: entry.date,
    backgroundColor: moodColors[entry.mood],
    borderColor: moodColors[entry.mood],
    description: moodDescriptions[entry.mood],
    className: `mood-${entry.mood}`,
    allDay: true,
  }));

  return (
    <div 
      className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-md"
      role="region"
      aria-labelledby="calendar-title"
    >
      <h2 id="calendar-title" className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        Mood Calendar
      </h2>
      <div className="fc-size-adjust">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
          }}
          views={{
            dayGridMonth: {
              titleFormat: { month: 'long', year: 'numeric' },
              fixedWeekCount: false,
              showNonCurrentDates: true,
            },
            timeGridWeek: {
              titleFormat: { month: 'short', day: 'numeric', year: 'numeric' },
              slotMinTime: '06:00:00',
              slotMaxTime: '22:00:00',
              expandRows: true,
            },
            timeGridDay: {
              titleFormat: { month: 'long', day: 'numeric', year: 'numeric' },
              slotMinTime: '06:00:00',
              slotMaxTime: '22:00:00',
              expandRows: true,
            },
          }}
          dayMaxEvents={true}
          eventDisplay="block"
          eventContent={(eventInfo) => (
            <div
              role="button"
              tabIndex={0}
              aria-label={`Mood for ${eventInfo.event.startStr}: ${eventInfo.event.extendedProps.description}`}
              className="w-full h-full flex items-center justify-center p-1"
            >
              <span className="text-base sm:text-lg">{eventInfo.event.title}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
};