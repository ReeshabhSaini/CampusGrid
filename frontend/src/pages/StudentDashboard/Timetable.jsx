import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

const Timetable = ({ branch, semester }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState("week"); // State to manage the current view

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
    const fetchTimetableAndHolidays = async () => {
      try {
        const response1 = await axios.post(`${url}/api/student/timetable`, {
          branch: studentData.branch,
          semester: studentData.semester,
          class_group: studentData.class_group,
          tutorial_group: studentData.tutorial_group,
          lab_group: studentData.lab_group,
        });

        const response2 = await axios.post(`${url}/api/student/reschedules`, {
          branch: studentData.branch,
          semester: studentData.semester,
          class_group: studentData.class_group,
          tutorial_group: studentData.tutorial_group,
          lab_group: studentData.lab_group,
        });

        const response3 = await axios.get(`${url}/api/student/holidays`);

        const { classes } = response1.data.response;
        const { rescheduled_classes } = response2.data;
        const { holidays } = response3.data;

        const holidayDates = new Set(
          holidays.map((holiday) =>
            moment(holiday.holiday_date).format("YYYY-MM-DD")
          )
        );

        const originalEvents = [];
        for (let i = 0; i < 4; i++) {
          const weekStart = moment().startOf("week").add(i, "weeks");
          classes.forEach((event) => {
            const dayIndex = daysOfWeek.indexOf(event.day_of_week);
            const classDate = weekStart.clone().add(dayIndex, "days");

            if (holidayDates.has(classDate.format("YYYY-MM-DD"))) return;

            const startDate = classDate.clone().set({
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

            const type = event.courses.course_code.includes("T")
              ? "tutorial"
              : event.courses.course_code.includes("L")
              ? "lab"
              : "class";

            originalEvents.push({
              id: `${event.id}-${i}`,
              title: `${event.courses.course_code} - ${event.lecture_halls.hall_name}`,
              start: startDate.toDate(),
              end: endDate.toDate(),
              type: type,
              details: {
                courseName: event.courses.course_name,
                branch: event.courses.branch,
                semester: event.courses.semester,
                courseCode: event.courses.course_code,
                lectureHall: event.lecture_halls.hall_name,
                dayOfWeek: event.day_of_week,
                startTime: event.start_time,
                endTime: event.end_time,
                type: type,
              },
            });
          });
        }

        const rescheduledEvents = rescheduled_classes
          .filter(
            (event) =>
              !holidayDates.has(
                moment(event.rescheduled_date).format("YYYY-MM-DD")
              )
          )
          .map((event) => {
            const startDate = moment(event.rescheduled_date).set({
              hour: parseInt(event.new_time.split(":")[0], 10),
              minute: parseInt(event.new_time.split(":")[1], 10),
            });

            const endDate = moment(startDate).add(1, "hour");

            return {
              id: `rescheduled-${event.id}`,
              title: `${event.courses.course_code} - ${event.lecture_halls.hall_name}`,
              start: startDate.toDate(),
              end: endDate.toDate(),
              type: "rescheduled",
              details: {
                courseName: event.courses.course_name,
                branch: event.courses.branch,
                semester: event.courses.semester,
                courseCode: event.courses.course_code,
                lectureHall: event.lecture_halls.hall_name,
                originalDate: event.original_date,
                rescheduledDate: event.rescheduled_date,
                reason: event.reason,
                newTime: event.new_time,
                type: "rescheduled",
              },
            };
          });

        const holidayEvents = holidays.map((holiday) => {
          const holidayDate = moment(holiday.holiday_date);
          const startDate = holidayDate.clone().set({ hour: 0, minute: 0 });
          const endDate = holidayDate.clone().set({ hour: 23, minute: 59 });

          return {
            id: `holiday-${holiday.id}`,
            title: holiday.description,
            start: startDate.toDate(),
            end: endDate.toDate(),
            allDay: true,
            isHoliday: true,
          };
        });

        const finalEvents = [
          ...holidayEvents,
          ...originalEvents,
          ...rescheduledEvents,
        ];

        setEvents(finalEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching timetable and holidays:", error);
        setError("Failed to fetch timetable or holidays.");
        setLoading(false);
      }
    };

    fetchTimetableAndHolidays();
  }, [studentData.branch, studentData.semester, url]);

  const handleEventClick = (event) => {
    if (event.isHoliday) {
      setSelectedEvent({
        ...event,
        details: {
          description: event.title,
          holidayDate: moment(event.start).format("YYYY-MM-DD"),
        },
      });
    } else {
      setSelectedEvent(event);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor;
    switch (event.type) {
      case "class":
        backgroundColor = "#3182ce";
        break;
      case "tutorial":
        backgroundColor = "#9f7aea";
        break;
      case "lab":
        backgroundColor = "#48bb78";
        break;
      case "rescheduled":
        backgroundColor = "#f6ad55";
        break;
      default:
        backgroundColor = "#3182ce";
        break;
    }
    if (event.id.startsWith("holiday")) {
      backgroundColor = "#34d399";
    }
    return {
      style: {
        backgroundColor: isSelected ? "#2b6cb0" : backgroundColor,
        color: "white",
        borderRadius: "5px",
        padding: "4px",
        textAlign: "center",
        border: isSelected ? "2px solid #2563eb" : "none",
      },
    };
  };

  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "hh:mm A", culture),
    eventTimeRangeFormat: () => "",
    agendaTimeRangeFormat: () => "",
  };

  if (loading) return <div>Loading timetable...</div>;
  if (error) return <div>{error}</div>;
    const CustomToolbar = ({ label, onNavigate }) => (
      <div className="flex justify-between items-center py-2 px-4 bg-gray-100 shadow-md rounded-lg">
        <button
          onClick={() => onNavigate("PREV")}
          className="text-2xl text-blue-600 hover:text-blue-800 transition duration-200"
        >
          <FaArrowLeft />
        </button>
        <span className="font-bold text-lg">{label}</span>
        <button
          onClick={() => onNavigate("NEXT")}
          className="text-2xl text-blue-600 hover:text-blue-800 transition duration-200"
        >
          <FaArrowRight />
        </button>
        <div className="ml-4">
          <button
            onClick={() => {
              setView("day");
              onNavigate("TODAY");
            }}
            className={`px-2 py-1 ${
              view === "day" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => {
              setView("week");
              onNavigate("TODAY");
            }}
            className={`px-2 py-1 ${
              view === "week" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => {
              setView("day");
              onNavigate("TODAY");
            }}
            className="ml-2 px-2 py-1 bg-blue-600 text-white"
          >
            Today
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex">
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Student Timetable</h2>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            eventPropGetter={eventStyleGetter}
            views={["day", "week"]} // Include Day view
            view={view} // Set the current view
            onView={setView} // Update the view state
            formats={formats}
            onSelectEvent={handleEventClick}
            min={new Date(2024, 11, 22, 8, 0)} // Start time at 8 AM
            max={new Date(2024, 11, 22, 17, 0)} // End time at 5 PM
            components={{
              toolbar: CustomToolbar,
              day: {
                event: (event) => (
                  <div className="p-2 border-b border-gray-200 hover:bg-gray-200 transition duration-200">
                    <strong>{event.title}</strong>
                    {/* Removed timing display */}
                  </div>
                ),
              },
            }}
          />
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-yellow-50 rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">
              {selectedEvent.isHoliday ? "Holiday Details" : "Class Details"}
            </h3>

            {selectedEvent.isHoliday ? (
              <>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedEvent.details.description}
                </p>
                <p>
                  <strong>Date:</strong> {selectedEvent.details.holidayDate}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Course Name:</strong>{" "}
                  {selectedEvent.details.courseName}
                </p>
                <p>
                  <strong>Branch:</strong> {selectedEvent.details.branch}
                </p>
                <p>
                  <strong>Semester:</strong> {selectedEvent.details.semester}
                </p>
                <p>
                  <strong>Course Code:</strong>{" "}
                  {selectedEvent.details.courseCode}
                </p>
                <p>
                  <strong>Lecture Hall:</strong>{" "}
                  {selectedEvent.details.lectureHall}
                </p>
                <p>
                  <strong>Day of Week:</strong>{" "}
                  {selectedEvent.details.dayOfWeek}
                </p>
                <p>
                  <strong>Start Time:</strong> {selectedEvent.details.startTime}
                </p>
                <p>
                  <strong>End Time:</strong> {selectedEvent.details.endTime}
                </p>
                <p>
                  <strong>Type:</strong> {selectedEvent.details.type}
                </p>
                {selectedEvent.details.rescheduledDate && (
                  <>
                    <hr className="my-4" />
                    <p>
                      <strong>Original Date:</strong>{" "}
                      {selectedEvent.details.originalDate}
                    </p>
                    <p>
                      <strong>Rescheduled Date:</strong>{" "}
                      {selectedEvent.details.rescheduledDate}
                    </p>
                    <p>
                      <strong>Reason:</strong> {selectedEvent.details.reason}
                    </p>
                    <p>
                      <strong>New Time:</strong> {selectedEvent.details.newTime}
                    </p>
                  </>
                )}
              </>
            )}

            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
