import React, { useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

const ReschedulePage = ({ event }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [lectureHalls, setLectureHalls] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedHall, setSelectedHall] = useState("");
  const [reason, setReason] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingHalls, setLoadingHalls] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(true);
  const [showLectureHalls, setShowLectureHalls] = useState(false);
  const navigate = useNavigate();
  const { url, rescheduleRequest, setRescheduleRequest, professorData } =
    useContext(StoreContext);

  const handleSelectDate = (slotInfo) => {
    setSelectedDate(slotInfo.start || slotInfo);
    setSelectedTime("");
    setSelectedHall("");
    setShowTimeSlots(true); // Show time slots
    setShowLectureHalls(false); // Hide lecture halls
    fetchAvailableSlots(slotInfo.start || slotInfo);
  };

  const fetchAvailableSlots = async (date) => {
    if (!date) return;
    setLoadingSlots(true);

    try {
      const response = await axios.post(`${url}/api/get/available/slots`, {
        selectedDate: date.toISOString().split("T")[0],
        professorId: professorData.id,
        branch: rescheduleRequest.details.branch,
        semester: rescheduleRequest.details.semester,
      });
      const { freeSlots } = response.data;
      setTimeSlots(freeSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      alert("Failed to fetch free time slots. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchAvailableHalls = async (timeSlot) => {
    if (!timeSlot || !selectedDate) return;
    setShowLoadingScreen(true);

    try {
      const response = await axios.post(`${url}/api/get/available/halls`, {
        selectedDate: selectedDate.toISOString().split("T")[0],
        selectedTimeSlot: timeSlot,
      });
      const { availableHalls } = response.data;
      setLectureHalls(availableHalls);
    } catch (error) {
      console.error("Error fetching lecture halls:", error);
      alert(
        error.response?.data?.error ||
          "Failed to fetch lecture halls. Please try again."
      );
    } finally {
      setShowLoadingScreen(false);
      setLoadingHalls(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime || !selectedHall || !reason) {
      alert("Please complete all fields before submitting.");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/reschedule/request`, {
        course_id: rescheduleRequest.details.courseId,
        original_date: moment(rescheduleRequest.start).format("YYYY-MM-DD"),
        rescheduled_date: moment(selectedDate).format("YYYY-MM-DD"),
        reason: reason,
        professor_id: professorData.id,
        lecture_hall_id: rescheduleRequest.details.lectureHallId,
        selected_time: selectedTime,
      });

      toast.success(response.data.message);
      navigate("/tdashboard");
    } catch (error) {
      console.error(
        "Error submitting reschedule request:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error || "Failed to submit reschedule request."
      );
    }
  };

  const dayPropGetter = (date) => {
    if (selectedDate && moment(date).isSame(moment(selectedDate), "day")) {
      return {
        style: {
          backgroundColor: "#a4cafe",
          color: "black",
        },
      };
    }
    return {};
  };

  const handleSelectTime = (slot) => {
    setSelectedTime(slot);
    setShowTimeSlots(false); // Hide time slots after selection
    setShowLectureHalls(true); // Show lecture halls
    fetchAvailableHalls(slot);
  };

  const handleSelectHall = (hall) => {
    setSelectedHall(hall);
    setShowLectureHalls(false); // Hide lecture halls after selection
  };

  // Loading Spinner component using Tailwind CSS
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen" style={{ background: "transparent" }}>
      <h2 className="text-4xl font-extrabold text-black-700 mb-6 text-center">
        Reschedule Event
      </h2>
      <div className="flex flex-row">
        <div className="flex-1 shadow-lg rounded-lg p-4">
          <h3 className="text-3xl font-bold mb-4 text-blue-600">Details</h3>
          <p className="text-lg">
            <strong>Course Name:</strong> {rescheduleRequest.details.courseName}
          </p>
          <p className="text-lg">
            <strong>Branch:</strong> {rescheduleRequest.details.branch}
          </p>
          <p className="text-lg">
            <strong>Semester:</strong> {rescheduleRequest.details.semester}
          </p>
          <p className="text-lg">
            <strong>Course Code:</strong> {rescheduleRequest.details.courseCode}
          </p>
          <p className="text-lg">
            <strong>Lecture Hall:</strong>{" "}
            {rescheduleRequest.details.lectureHallName}
          </p>
          <p className="text-lg">
            <strong>Original Date:</strong>{" "}
            {moment(rescheduleRequest.start).format("DD-MM-YYYY")}
          </p>
          <p className="text-lg text-red-500">
            <strong>
              Selected Date: {moment(selectedDate).format("DD-MM-YYYY")}
            </strong>
          </p>
          {selectedTime && (
            <p className="text-lg text-blue-500">
              <strong>Selected Time Slot:</strong> {selectedTime}
            </p>
          )}
          {selectedHall && (
            <p className="text-lg text-green-500">
              <strong>Selected Lecture Hall:</strong> {selectedHall}
            </p>
          )}
        </div>

        <div className="flex-1 shadow-lg rounded-lg p-4">
          <h3 className="text-3xl font-bold mb-4 text-blue-600">
            Select New Date:
          </h3>
          <Calendar
            localizer={localizer}
            selectable
            onSelectSlot={handleSelectDate}
            onDrillDown={handleSelectDate}
            defaultView="month"
            views={["month"]}
            defaultDate={new Date()}
            dayPropGetter={dayPropGetter}
            style={{ height: 400 }}
            startAccessor="start"
            endAccessor="end"
            className="rounded-lg border border-gray-300"
            components={{
              toolbar: ({ onNavigate }) => (
                <div className="flex justify-between mb-4">
                  <button
                    onClick={() => onNavigate("PREV")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    &larr;
                  </button>
                  <span className="font-semibold text-blue-600">
                    {moment(selectedDate).format("MMMM YYYY")}
                  </span>
                  <button
                    onClick={() => onNavigate("NEXT")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    &rarr;
                  </button>
                </div>
              ),
            }}
          />
        </div>

        <div className="flex-1 shadow-lg rounded-lg p-4 space-y-6">
          {!showLoadingScreen ? (
            <>
              {showTimeSlots && (
                <div>
                  <h3 className="text-3xl font-bold text-blue-600">
                    Select a Time Slot:
                  </h3>
                  <ul className="space-y-2">
                    {loadingSlots && (
                      <p className="text-blue-500">Loading slots...</p>
                    )}
                    {timeSlots.map((slot, index) => (
                      <li
                        key={index}
                        className={`cursor-pointer p-2 border rounded-lg transition-transform duration-300 ease-in-out ${
                          selectedTime === slot
                            ? "bg-blue-100 border-blue-500 scale-105"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleSelectTime(slot)}
                      >
                        {slot}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showLectureHalls && selectedTime && (
                <div>
                  <h3 className="text-3xl font-bold text-blue-600">
                    Select a Lecture Hall:
                  </h3>
                  <ul className="space-y-2">
                    {loadingHalls && (
                      <p className="text-blue-500">Loading halls...</p>
                    )}
                    {lectureHalls.length > 0 ? (
                      lectureHalls.map((hall) => (
                        <li
                          key={hall}
                          className={`cursor-pointer p-2 border rounded-lg transition-transform duration-300 ease-in-out ${
                            selectedHall === hall
                              ? "bg-green-100 border-green-500 scale-105"
                              : "border-gray-300"
                          }`}
                          onClick={() => handleSelectHall(hall)}
                        >
                          {hall}
                        </li>
                      ))
                    ) : (
                      <p className="text-red-500">
                        No lecture halls available. Please choose a different
                        time slot.
                      </p>
                    )}
                  </ul>
                </div>
              )}

              {selectedTime && !selectedHall && (
                <button
                  onClick={() => {
                    setShowTimeSlots(true); // Show time slots again
                    setShowLectureHalls(false); // Hide lecture halls
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300"
                >
                  Back to Time Slots
                </button>
              )}

              {selectedHall && (
                <div>
                  <div>
                    <label
                      className="block font-bold text-blue-600 mb-2 text-3xl"
                      htmlFor="reason"
                    >
                      Reason for Rescheduling:
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 text-gray-700 bg-yellow-50 focus:ring-2 focus:ring-blue-400 shadow-sm hover:bg-gray-50 transition-all"
                      placeholder="Provide a reason for rescheduling..."
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setShowTimeSlots(true); // Show time slots again
                        setShowLectureHalls(false); // Hide lecture halls
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300"
                    >
                      Back to Time Slots
                    </button>
                    <button
                      onClick={() => setSelectedHall("")}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300"
                    >
                      Back to Lecture Halls
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="text-blue-500 font-semibold">
                Fetching available lecture halls...
              </p>
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handleReschedule}
          className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-colors ${
            selectedDate && selectedTime && selectedHall && reason
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          }`}
          disabled={!selectedDate || !selectedTime || !selectedHall || !reason}
        >
          Reschedule
        </button>
        <button
          onClick={() => navigate("/tdashboard")}
          className="px-6 py-3 text-lg font-semibold bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReschedulePage;
