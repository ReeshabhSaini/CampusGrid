import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const localizer = momentLocalizer(moment);

const Timetable = ({ branch, semester }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { url, studentData } = useContext(StoreContext);

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
        const response1 = await axios.post(`${url}/api/student/timetable`, {
          branch: "ECE",
          semester: "3",
        });

        const response2 = await axios.post(`${url}/api/student/reschedules`, {
          branch: "ECE",
          semester: "3",
        });

        const { classes } = response1.data;
        const { rescheduled_classes } = response2.data;

        // Generate weekly recurring events for original timetable
        const originalEvents = [];
        for (let i = 0; i < 4; i++) {
          // Assuming the timetable repeats for 4 weeks
          const weekStart = moment().startOf("week").add(i, "weeks");
          classes.forEach((event) => {
            const dayIndex = daysOfWeek.indexOf(event.day_of_week);
            const startDate = weekStart
              .clone()
              .add(dayIndex, "days")
              .set({
                hour: parseInt(event.start_time.split(":")[0], 10),
                minute: parseInt(event.start_time.split(":")[1], 10),
              });

            const endDate = startDate
              .clone()
              .add(
                parseInt(event.end_time.split(":")[0], 10) -
                  parseInt(event.start_time.split(":")[0], 10),
                "hours"
              )
              .add(
                parseInt(event.end_time.split(":")[1], 10) -
                  parseInt(event.start_time.split(":")[1], 10),
                "minutes"
              );

            originalEvents.push({
              id: `${event.id}-${i}`,
              title: `${event.courses.course_name} - Lecture Hall ${event.lecture_halls.hall_name}`,
              start: startDate.toDate(),
              end: endDate.toDate(),
            });
          });
        }

        // Format rescheduled events
        const rescheduledEvents = rescheduled_classes.map((event) => {
          const startDate = moment(event.rescheduled_date).set({
            hour: parseInt(event.new_time.split(":")[0], 10),
            minute: parseInt(event.new_time.split(":")[1], 10),
          });

          const endDate = moment(startDate).add(1, "hour"); // Assuming a fixed 1-hour duration for rescheduled classes

          return {
            id: `rescheduled-${event.id}`,
            title: `${event.courses.course_name} (Rescheduled) - Lecture Hall ${event.lecture_halls.hall_name}`,
            start: startDate.toDate(),
            end: endDate.toDate(),
          };
        });

        // Remove overwritten events from originalEvents
        const filteredOriginalEvents = originalEvents.filter((event) => {
          return !rescheduled_classes.some((rescheduled) => {
            const originalDate = moment(rescheduled.original_date).toDate();
            return (
              event.start.toDateString() === originalDate.toDateString() &&
              event.title.includes(rescheduled.courses.course_name)
            );
          });
        });

        // Combine original and rescheduled events
        setEvents([...filteredOriginalEvents, ...rescheduledEvents]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching timetable:", error);
        setError("Failed to fetch timetable.");
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [studentData.branch, studentData.semester, url]);

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
            min={new Date(2024, 11, 22, 8, 0)} // Set minimum time to 8 AM
            max={new Date(2024, 11, 22, 17, 0)} // Set maximum time to 5 PM
          />
        </div>
      </div>
    </div>
  );
};

export default Timetable;
