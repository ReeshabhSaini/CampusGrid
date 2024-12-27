import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const localizer = momentLocalizer(moment);

const Timetable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { url, studentData } = useContext(StoreContext);

  // Days of the week array for mapping
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        // Fetching branch and semester from the context
        const branch = "ECE";
        const semester = "3";

        const response = await axios.post(`${url}/api/student/timetable`, {
          branch,
          semester,
        });

        if (
          !response.data ||
          !response.data.classes ||
          response.data.classes.length === 0
        ) {
          throw new Error(
            "No classes found for the given branch and semester."
          );
        }

        // Formatting the data into Big Calendar event format
        const formattedEvents = response.data.classes.map((event) => {
          const dayIndex = daysOfWeek.indexOf(event.day_of_week.toLowerCase());

          // Start and end date-time creation
          const startDate = moment()
            .startOf("week")
            .add(dayIndex, "days")
            .set({
              hour: moment(event.start_time, "HH:mm:ss").hours(),
              minute: moment(event.start_time, "HH:mm:ss").minutes(),
            });

          const endDate = moment(startDate).set({
            hour: moment(event.end_time, "HH:mm:ss").hours(),
            minute: moment(event.end_time, "HH:mm:ss").minutes(),
          });

          return {
            id: event.id,
            title: `${event.courses.course_name} - Lecture Hall: ${event.lecture_halls.hall_name}`,
            start: startDate.toDate(),
            end: endDate.toDate(),
          };
        });

        setEvents(formattedEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching timetable:", error.message || error);
        setError("Failed to fetch timetable. Please try again later.");
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [url, studentData]);

  // Style for individual events
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

  // Customizing time and event formatting
  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "hh:mm A", culture),
    eventTimeRangeFormat: () => "",
    agendaTimeRangeFormat: () => "",
  };

  if (loading) return <div>Loading timetable...</div>;
  if (error) return <div>{error}</div>;

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
            min={new Date(2024, 11, 22, 8, 0)} // Minimum time (8:00 AM)
            max={new Date(2024, 11, 22, 17, 0)} // Maximum time (5:00 PM)
          />
        </div>
      </div>
    </div>
  );
};

export default Timetable;
