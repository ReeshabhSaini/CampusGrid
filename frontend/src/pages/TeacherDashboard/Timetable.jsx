import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token or decoding failed:", error);
    return null;
  }
}

const Timetable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState("day"); // Set default view to day

  const { url, setToken, rescheduleRequest, setRescheduleRequest } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const fetchData = async () => {
    try {
      const decodedToken = decodeJWT(token);
      if (!decodedToken) {
        setToken("");
        navigate("/login");
        return;
      }

      const { id } = decodedToken;

      // Fetch holidays, timetable, and reschedules
      const holidaysResponse = await axios.get(`${url}/api/professor/holidays`);
      const timetableResponse = await axios.post(
        `${url}/api/professor/timetable`,
        { id }
      );
      const reschedulesResponse = await axios.post(
        `${url}/api/professor/reschedules`,
        { id }
      );

      // Process holidays
      const holidays = holidaysResponse.data.holidays.map((holiday) => ({
        id: `holiday-${holiday.id}`,
        title: holiday.description,
        start: moment(holiday.holiday_date).toDate(),
        end: moment(holiday.holiday_date).toDate(),
        allDay: true,
      }));

      // Extract holiday dates for easy comparison later
      const holidayDates = holidays.map((holiday) =>
        moment(holiday.start).format("YYYY-MM-DD")
      );

      // Process timetable and rescheduled classes
      const { classes } = timetableResponse.data;
      const { rescheduled_classes } = reschedulesResponse.data;

      const originalEvents = [];
      for (let i = 0; i < 4; i++) {
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

          // Skip events that fall on holidays
          if (holidayDates.includes(startDate.format("YYYY-MM-DD"))) {
            return;
          }

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
            title: `${event.courses.course_code} - ${event.lecture_halls.hall_name}`,
            start: startDate.toDate(),
            end: endDate.toDate(),
            details: {
              id: event.id,
              courseCode: event.courses.course_code,
              courseId: event.courses.id,
              courseName: event.courses.course_name,
              branch: event.courses.branch,
              semester: event.courses.semester,
              type: event.type,
              group: event.group,
              lectureHall: event.lecture_halls.hall_name,
              lectureHallId: event.lecture_halls.id,
              dayOfWeek: event.day_of_week,
              startTime: event.start_time,
              endTime: event.end_time,
            },
          });
        });
      }

      const rescheduledEvents = rescheduled_classes.map((event) => {
        const startDate = moment(event.rescheduled_date).set({
          hour: parseInt(event.new_time.split(":")[0], 10),
          minute: parseInt(event.new_time.split(":")[1], 10),
        });

        const endDate = moment(startDate).add(1, "hour");

        return {
          id: `rescheduled-${event.id}`,
          title: `${event.courses.course_code} - ${event.lecture_halls.hall_name} (Rescheduled)`,
          start: startDate.toDate(),
          end: endDate.toDate(),
          details: {
            id: event.id,
            courseCode: event.courses.course_code,
            courseId: event.courses.id,
            courseName: event.courses.course_name,
            branch: event.courses.branch,
            semester: event.courses.semester,
            type: event.type,
            group: event.group,
            lectureHall: event.lecture_halls.hall_name,
            lectureHallId: event.lecture_halls.id,
            originalDate: event.original_date,
            originalStartTime: event.original_start_time,
            originalEndTime: event.original_end_time,
            rescheduledDate: event.rescheduled_date,
            reason: event.reason,
            newTime: event.new_time,
          },
        };
      });

      const filteredOriginalEvents = originalEvents.filter((event) => {
        return !rescheduled_classes.some((rescheduled) => {
          const originalDate = moment(rescheduled.original_date);
          const originalStartTime = moment(
            rescheduled.original_start_time,
            "HH:mm"
          );
          const originalEndTime = moment(
            rescheduled.original_end_time,
            "HH:mm"
          );

          // Combine the original date with start and end time
          const originalDateTime = originalDate.set({
            hour: originalStartTime.hours(),
            minute: originalStartTime.minutes(),
          });
          const originalEndDateTime = originalDate.set({
            hour: originalEndTime.hours(),
            minute: originalEndTime.minutes(),
          });

          const eventStartTime = moment(event.start);
          const eventEndTime = moment(event.end);

          // Log the times for debugging
          console.log(
            `Event Start: ${eventStartTime.format(
              "YYYY-MM-DD HH:mm"
            )}, Event End: ${eventEndTime.format("YYYY-MM-DD HH:mm")}`
          );
          console.log(
            `Original DateTime: ${originalDateTime.format(
              "YYYY-MM-DD HH:mm"
            )}, Original EndTime: ${originalEndDateTime.format(
              "YYYY-MM-DD HH:mm"
            )}`
          );

          // Exclude the event if its start time and end time match the original class's original times
          return (
            eventStartTime.isSame(originalDateTime) &&
            eventEndTime.isSame(originalEndDateTime)
          );
        });
      });

      setEvents([...filteredOriginalEvents, ...rescheduledEvents, ...holidays]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchData();
  }, [token, url]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setRescheduleRequest(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setRescheduleRequest(null);
  };

  const handleCancelReschedule = async () => {
    if (!selectedEvent || !selectedEvent.details.id) {
      console.error("No reschedule ID provided.");
      return;
    }

    try {
      const response = await axios.delete(
        `${url}/api/professor/cancel-reschedule`,
        {
          data: { rescheduleId: selectedEvent.details.id },
        }
      );

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedEvent.id)
      );

      toast.success(response.data.message);
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error canceling reschedule:", error);
    }
  };

  const handleRescheduleClick = () => {
    navigate("/tdashboard/reschedule", { state: { event: selectedEvent } });
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor;
    if (event.id.startsWith("holiday")) {
      backgroundColor = "#34d399"; // Green for holidays
    } else if (event.title.includes("(Rescheduled)")) {
      backgroundColor = "#f59e0b"; // Orange for rescheduled
    } else {
      backgroundColor = isSelected ? "#1d4ed8" : "#3174ad";
    }
    return {
      style: {
        backgroundColor,
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
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-4">Professor Timetable</h2>
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

      {selectedEvent &&
        (selectedEvent.id.startsWith("holiday") ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h3 className="text-xl font-bold mb-4">Holiday Details</h3>
              <p>
                <strong>Holiday Name:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {moment(selectedEvent.start).format("YYYY-MM-DD")}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h3 className="text-xl font-bold mb-4">Class Details</h3>
              <p>
                <strong>Course Name:</strong> {selectedEvent.details.courseName}
              </p>
              <p>
                <strong>Branch:</strong> {selectedEvent.details.branch}
              </p>
              <p>
                <strong>Semester:</strong> {selectedEvent.details.semester}
              </p>
              <p>
                <strong>Type:</strong> {selectedEvent.details.type}
              </p>
              <p>
                <strong>Group:</strong> {selectedEvent.details.group}
              </p>
              <p>
                <strong>Course Code:</strong> {selectedEvent.details.courseCode}
              </p>
              <p>
                <strong>Lecture Hall:</strong>{" "}
                {selectedEvent.details.lectureHall}
              </p>
              {selectedEvent.details.originalDate && (
                <p>
                  <strong>Original Date:</strong>{" "}
                  {selectedEvent.details.originalDate}
                </p>
              )}
              {selectedEvent.details.rescheduledDate && (
                <p>
                  <strong>Rescheduled Date:</strong>{" "}
                  {selectedEvent.details.rescheduledDate}
                </p>
              )}
              {selectedEvent.details.reason && (
                <p>
                  <strong>Reason:</strong> {selectedEvent.details.reason}
                </p>
              )}
              <div className="mt-4 flex justify-end">
                {selectedEvent.title.includes("(Rescheduled)") ? (
                  <button
                    onClick={handleCancelReschedule}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                  >
                    Cancel Reschedule
                  </button>
                ) : (
                  <button
                    onClick={handleRescheduleClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                  >
                    Reschedule
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="px-4 py-2 ml-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Timetable;
