import React, { useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

const AutoResizeTextarea = ({ value, onChange, placeholder }) => {
  const textareaRef = React.useRef(null);

  const handleInput = (e) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust to fit content
    }
    if (onChange) onChange(e); // Call the onChange prop
  };

  return (
    <textarea
      ref={textareaRef}
      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition duration-300 ease-in-out text-gray-800 placeholder-gray-400 resize-none overflow-hidden"
      value={value}
      onInput={handleInput}
      placeholder={
        placeholder ||
        "Enter your reason here only after making sure right slots are selected...."
      }
      rows={2} // Start with a single row
    />
  );
};

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
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showLectureHalls, setShowLectureHalls] = useState(false);
  const navigate = useNavigate();
  const { url, rescheduleRequest, professorData } = useContext(StoreContext);

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
    setLoadingHalls(true); // Set loadingHalls to true

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
      setLoadingHalls(false); // Set loadingHalls to false
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
        lecture_hall: selectedHall,
        selected_time: selectedTime,
        type: rescheduleRequest.details.type,
        group: rescheduleRequest.details.group,
        original_start_time: rescheduleRequest.details.startTime,
        original_end_time: rescheduleRequest.details.endTime,
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

  // Loading Spinner component using Tailwind CSS
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h1 className="text-4xl font-extrabold text-black-700 mb-6 text-center">
        Reschedule Event
      </h1>
      <div className="flex space-x-4 w-full">
        {/* Box 1: Details */}
        <div className="flex-1 border rounded-lg shadow p-4 h-[500px] max-h-[500px] overflow-y-auto">
          <h2 className="text-3xl font-bold mb-4 text-black-600">Details</h2>
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
            <strong>Type:</strong> {rescheduleRequest.details.type}
          </p>
          <p className="text-lg">
            <strong>Group:</strong> {rescheduleRequest.details.group}
          </p>
          <p className="text-lg">
            <strong>Course Code:</strong> {rescheduleRequest.details.courseCode}
          </p>
          <p className="text-lg">
            <strong>Lecture Hall:</strong>{" "}
            {rescheduleRequest.details.lectureHall}
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

        {/* Box 2: Calendar */}
        <div className="flex-1 border rounded-lg shadow p-4 h-[500px] max-h-[500px] overflow-y-auto">
          <h2 className="text-3xl font-bold mb-4 text-black-600">Calendar</h2>
          <Calendar
            localizer={localizer}
            selectable
            onSelectSlot={handleSelectDate}
            style={{ height: "400px" }}
            dayPropGetter={(date) => {
              const today = moment().startOf("day");
              const isToday = today.isSame(date, "day");
              const isSelected = moment(selectedDate).isSame(date, "day");
              const isOriginal = moment(rescheduleRequest.start).isSame(
                date,
                "day"
              );

              return {
                style: {
                  backgroundColor: isToday
                    ? "lightblue"
                    : isSelected
                    ? "lightgreen"
                    : isOriginal
                    ? "lightcoral"
                    : undefined,
                  color:
                    isToday || isSelected || isOriginal ? "white" : undefined,
                },
              };
            }}
            components={{
              toolbar: (props) => (
                <div className="flex justify-between items-center py-2 px-4 bg-transparent shadow-md rounded-lg">
                  <button
                    onClick={() => props.onNavigate("PREV")}
                    className="text-2xl text-blue-600 hover:text-blue-800 transition duration-200"
                  >
                    &lt;
                  </button>
                  <span className="font-bold text-lg">{props.label}</span>
                  <button
                    onClick={() => props.onNavigate("NEXT")}
                    className="text-2xl text-blue-600 hover:text-blue-800 transition duration-200"
                  >
                    &gt;
                  </button>
                </div>
              ),
            }}
          />
        </div>

        <div className="flex-1 border rounded-lg shadow p-4 h-[500px] max-h-[500px] overflow-y-auto">
          <h2 className="text-3xl font-bold mb-4 text-black-600">
            Make a Selection
          </h2>
          {loadingSlots ? (
            <div className="flex flex-col items-center">
              <LoadingSpinner />
              <p>Loading available time slots...</p>
            </div>
          ) : loadingHalls ? (
            <div className="flex flex-col items-center">
              <LoadingSpinner />
              <p>Loading available lecture halls...</p>
            </div>
          ) : (
            <div>
              {!selectedHall && !reason ? (
                <div>
                  {showLectureHalls ? (
                    <div>
                      <h3 className="font-semibold">Select Lecture Hall:</h3>
                      <div className="h-[350px] max-h-[350px] overflow-y-auto border">
                        {lectureHalls.length > 0 ? (
                          lectureHalls.map((hall, idx) => (
                            <button
                              key={idx}
                              className={`block w-full p-2 my-1 ${
                                selectedHall === hall
                                  ? "bg-blue-500 text-white"
                                  : "bg-yellow-100 border-2 border-solid border-black p-1 rounded-lg"
                              }`}
                              onClick={() => handleSelectHall(hall)}
                            >
                              {hall}
                            </button>
                          ))
                        ) : (
                          <p>No lecture halls available</p>
                        )}
                      </div>
                      <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => {
                          setSelectedTime("");
                          setShowTimeSlots(true);
                          setShowLectureHalls(false);
                        }}
                      >
                        Select Different Time Slot
                      </button>
                    </div>
                  ) : showTimeSlots ? (
                    <div>
                      <h3 className="font-semibold">Select Time Slot:</h3>
                      {timeSlots.length > 0 ? (
                        timeSlots.map((slot, idx) => (
                          <button
                            key={idx}
                            className={`block w-full p-2 my-1 ${
                              selectedTime === slot
                                ? "bg-blue-500 text-white"
                                : "bg-yellow-100 border-2 border-solid border-black p-1 rounded-lg"
                            }`}
                            onClick={() => handleSelectTime(slot)}
                          >
                            {slot}
                          </button>
                        ))
                      ) : (
                        <p>No time slots available</p>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold">Reason for Reschedule:</h3>
                  <AutoResizeTextarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)} // Corrected here
                    placeholder="Enter your reason here only after making sure right slots are selected...."
                  />

                  <div className="mt-4 flex space-x-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={() => {
                        setSelectedTime("");
                        setSelectedHall("");
                        setShowTimeSlots(true);
                        setShowLectureHalls(false);
                      }}
                    >
                      Select Different Time Slot
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={() => {
                        setSelectedHall("");
                        setShowLectureHalls(true);
                      }}
                    >
                      Select Different Lecture Hall
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Button */}
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
