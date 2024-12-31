import React, { useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const localizer = momentLocalizer(moment);

const ReschedulePage = ({ event }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today's date
  const [timeSlots, setTimeSlots] = useState([]);
  const [lectureHalls, setLectureHalls] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedHall, setSelectedHall] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingHalls, setLoadingHalls] = useState(false);
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  const handleSelectDate = (slotInfo) => {
    setSelectedDate(slotInfo.start || slotInfo); // Handle both slot and direct date clicks
    setSelectedTime("");
    setSelectedHall("");
    setLectureHalls([]);
    fetchAvailableSlots(slotInfo.start || slotInfo);
  };

  const fetchAvailableSlots = async (date) => {
    if (!date) return;
    setLoadingSlots(true);

    try {
      const response = await axios.post(`${url}/api/get/available/slots`, {
        selectedDate: date.toISOString().split("T")[0],
        professorId: 2,
        branch: "ECE",
        semester: 3,
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
    setLoadingHalls(true);

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
      setLoadingHalls(false);
    }
  };

  const handleTimeSlotChange = (e) => {
    const selectedSlot = e.target.value;
    if (!selectedSlot) return;
    setSelectedTime(selectedSlot);
    setSelectedHall("");
    setLectureHalls([]);
    fetchAvailableHalls(selectedSlot);
  };

  const handleCancelClick = () => {
    navigate("/tdashboard");
  };

  const handleReschedule = () => {
    if (!selectedDate || !selectedTime || !selectedHall) {
      alert("Please complete all selections.");
      return;
    }

    const rescheduledEvent = {
      id: event.id,
      title: event.title,
      start: new Date(
        `${selectedDate.toDateString()} ${selectedTime.split(" - ")[0]}`
      ),
      end: new Date(
        `${selectedDate.toDateString()} ${selectedTime.split(" - ")[1]}`
      ),
      lectureHall: selectedHall,
    };

    console.log("Rescheduling event:", rescheduledEvent);
    alert(`Event "${event.title}" rescheduled successfully!`);
    navigate("/tdashboard");
  };

  // Custom function to highlight the selected date
  const dayPropGetter = (date) => {
    if (
      selectedDate &&
      moment(date).isSame(moment(selectedDate), "day") // Highlight only if the day matches
    ) {
      return {
        style: {
          backgroundColor: "#a4cafe", // Light blue background
          color: "black",
        },
      };
    }
    return {};
  };

  return (
    <div className="p-6 min-h-screen" style={{ background: "transparent" }}>
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Reschedule Event
      </h2>
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
        <div className="flex-1 bg-white shadow-lg rounded-lg p-4">
          <h3 className="font-semibold mb-4 text-blue-600">Select New Date:</h3>
          <Calendar
            localizer={localizer}
            selectable
            onSelectSlot={handleSelectDate}
            onDrillDown={handleSelectDate} // Capture clicks on date numbers
            defaultView="month"
            views={["month"]}
            defaultDate={new Date()} // Fix: Highlight current date initially
            dayPropGetter={dayPropGetter} // Apply custom styles
            style={{ height: 400 }}
            startAccessor="start"
            endAccessor="end"
            className="rounded-lg border border-gray-300"
          />
        </div>

        <div className="flex-1 bg-white shadow-lg rounded-lg p-4 space-y-6">
          <div>
            <h3 className="font-semibold text-blue-600">Selected Date:</h3>
            <p className="text-gray-700 text-lg">
              {selectedDate.toDateString()}
            </p>
          </div>

          {selectedDate && (
            <div>
              <label
                className="block font-semibold text-blue-600 mb-2"
                htmlFor="timeSlot"
              >
                Select Time Slot:
              </label>
              <select
                id="timeSlot"
                value={selectedTime}
                onChange={handleTimeSlotChange}
                className="w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 shadow-sm hover:bg-gray-50 transition-all"
                disabled={loadingSlots || timeSlots.length === 0}
              >
                <option value="">-- Select a Time Slot --</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {loadingSlots && (
                <p className="text-blue-500 mt-2">Loading slots...</p>
              )}
            </div>
          )}

          {selectedTime && (
            <div>
              <label
                className="block font-semibold text-blue-600 mb-2"
                htmlFor="lectureHall"
              >
                Select Lecture Hall:
              </label>
              <select
                id="lectureHall"
                value={selectedHall}
                onChange={(e) => setSelectedHall(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:ring-2 focus:ring-green-400 shadow-sm hover:bg-gray-50 transition-all"
                disabled={loadingHalls || lectureHalls.length === 0}
              >
                <option value="">-- Select a Lecture Hall --</option>
                {lectureHalls.map((hall) => (
                  <option key={hall} value={hall}>
                    {hall}
                  </option>
                ))}
              </select>
              {loadingHalls && (
                <p className="text-blue-500 mt-2">Loading halls...</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handleReschedule}
          className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-colors ${
            selectedDate && selectedTime && selectedHall
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          }`}
          disabled={!selectedDate || !selectedTime || !selectedHall}
        >
          Reschedule
        </button>
        <button
          onClick={handleCancelClick}
          className="px-6 py-3 text-lg font-semibold bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReschedulePage;
