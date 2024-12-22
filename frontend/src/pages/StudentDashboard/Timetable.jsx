import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

const localizer = momentLocalizer(moment);

const Timetable = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get("/api/student/timetable"); // Fetch timetable from backend
        const formattedEvents = response.data.map((event) => ({
          id: event.id,
          title: `${event.courseName} - Lecture Hall ${event.lectureHall}`,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          lectureHall: event.lectureHall,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };

    fetchTimetable();
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
          <h2 className="text-2xl font-bold">Student Timetable</h2>
        </div>

        {/* Calendar */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
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
