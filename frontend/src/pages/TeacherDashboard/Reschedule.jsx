import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const ReschedulePage = ({ event, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(null); // Store the selected date
  const [selectedTime, setSelectedTime] = useState(""); // Store the selected time slot
  const [selectedHall, setSelectedHall] = useState(""); // Store the selected lecture hall

  // Predefined lecture halls
  const lectureHalls = ["Lecture Hall A", "Lecture Hall B", "Lecture Hall C"];

  // Example time slots (you can replace this with dynamic data from an API)
  const timeSlots = [
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
  ];

  const handleSelectDate = ({ start }) => {
    setSelectedDate(start);
    setSelectedTime(""); // Reset selected time
    setSelectedHall(""); // Reset selected hall
  };

  const handleReschedule = () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    if (!selectedTime) {
      alert("Please select a time slot.");
      return;
    }
    if (!selectedHall) {
      alert("Please select a lecture hall.");
      return;
    }

    const rescheduledEvent = {
      id: event.id,
      title: event.title,
      start: new Date(`${selectedDate.toDateString()} ${selectedTime.split(" - ")[0]}`),
      end: new Date(`${selectedDate.toDateString()} ${selectedTime.split(" - ")[1]}`),
      lectureHall: selectedHall,
    };

    // Send updated event details to the backend or API
    console.log("Rescheduling event:", rescheduledEvent);
    alert(`Event "${event.title}" rescheduled successfully!`);
    onBack(); // Go back to the timetable
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reschedule Event</h2>
      <div className="flex space-x-8">
        {/* Calendar for Selecting Date */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Select New Date:</h3>
          <Calendar
            localizer={localizer}
            selectable
            onSelectSlot={handleSelectDate} // Allow selecting a date
            defaultView="month"
            views={["month"]}
            defaultDate={new Date()}
            style={{ height: 400 }}
            startAccessor="start"
            endAccessor="end"
          />
        </div>

        {/* Time Slot and Lecture Hall Selection */}
        <div className="flex-1 space-y-4">
          {/* Selected Date */}
          <div>
            <h3 className="font-semibold">Selected Date:</h3>
            <p className="text-gray-700">
              {selectedDate
                ? selectedDate.toDateString()
                : "No date selected. Please select a date from the calendar."}
            </p>
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div>
              <label className="block font-semibold mb-2" htmlFor="timeSlot">
                Select Time Slot:
              </label>
              <select
                id="timeSlot"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Select a Time Slot --</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Lecture Hall Selection */}
          {selectedDate && (
            <div>
              <label className="block font-semibold mb-2" htmlFor="lectureHall">
                Select Lecture Hall:
              </label>
              <select
                id="lectureHall"
                value={selectedHall}
                onChange={(e) => setSelectedHall(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Select a Lecture Hall --</option>
                {lectureHalls.map((hall) => (
                  <option key={hall} value={hall}>
                    {hall}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleReschedule}
          className={`px-4 py-2 ${
            selectedDate && selectedTime && selectedHall
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          } rounded`}
          disabled={!selectedDate || !selectedTime || !selectedHall}
        >
          Reschedule
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReschedulePage;
