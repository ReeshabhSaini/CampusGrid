import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

const Timetable = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Track selected event
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedEvents = [
        {
          id: 1,
          title: "Math - Lecture Hall A",
          start: new Date(2024, 11, 22, 10, 0),
          end: new Date(2024, 11, 22, 11, 0),
          lectureHall: "A",
        },
        {
          id: 2,
          title: "Science - Lecture Hall B",
          start: new Date(2024, 11, 22, 11, 0),
          end: new Date(2024, 11, 22, 12, 0),
          lectureHall: "B",
        },
        {
          id: 3,
          title: "History - Lecture Hall C",
          start: new Date(2024, 11, 22, 13, 0),
          end: new Date(2024, 11, 22, 14, 0),
          lectureHall: "C",
        },
      ];
      setEvents(fetchedEvents);
    };

    fetchData();
  }, []);

  const eventStyleGetter = (event, start, end, isSelected) => ({
    style: {
      backgroundColor: isSelected ? "#1d4ed8" : "#3174ad",
      color: "white",
      borderRadius: "5px",
      padding: "4px",
      textAlign: "center",
      border: isSelected ? "2px solid #2563eb" : "none",
    },
  });

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleRescheduleClick = () => {
    if (selectedEvent) {
      navigate(`/tdashboard/reschedule`, { state: { event: selectedEvent } });
    } else {
      alert("Please select an event to reschedule.");
    }
  };

  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "hh:mm A", culture),
    eventTimeRangeFormat: () => "",
    agendaTimeRangeFormat: () => "",
  };

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Timetable</h2>
          <div className="flex space-x-2">
            {/* Reschedule Button */}
            <button
              onClick={handleRescheduleClick}
              className={`px-4 py-2 rounded ${
                selectedEvent
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!selectedEvent}
            >
              Reschedule
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectEvent={handleEventSelect}
            eventPropGetter={eventStyleGetter}
            views={["month", "week", "day", "agenda"]}
            defaultView="week"
            formats={formats}
            min={new Date(2024, 11, 22, 8, 0)} // Set minimum time to 8 AM
            max={new Date(2024, 11, 22, 17, 0)} // Set maximum time to 5 PM
          />
        </div>
      </div>
    </div>
  );
};

export default Timetable;