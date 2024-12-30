import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const ReschedulePage = ({ event, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedHall, setSelectedHall] = useState("");

  const lectureHalls = ["Lecture Hall A", "Lecture Hall B", "Lecture Hall C"];

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
    setSelectedTime("");
    setSelectedHall("");
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
      start: new Date(${selectedDate.toDateString()} ${selectedTime.split(" - ")[0]}),
      end: new Date(${selectedDate.toDateString()} ${selectedTime.split(" - ")[1]}),
      lectureHall: selectedHall,
    };

    console.log("Rescheduling event:", rescheduledEvent);
    alert(Event "${event.title}" rescheduled successfully!);
    onBack();
  };

  return (
    <div className="p-6 min-h-screen" style={{ background: "transparent" }}>
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Reschedule Event</h2>
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
        {/* Calendar */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-4">
          <h3 className="font-semibold mb-4 text-blue-600">Select New Date:</h3>
          <Calendar
            localizer={localizer}
            selectable
            onSelectSlot={handleSelectDate}
            defaultView="month"
            views={["month"]}
            defaultDate={new Date()}
            style={{ height: 400 }}
            startAccessor="start"
            endAccessor="end"
            className="rounded-lg border border-gray-300"
          />
        </div>

        {/* Time Slot and Lecture Hall Selection */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-4 space-y-6">
          <div>
            <h3 className="font-semibold text-blue-600">Selected Date:</h3>
            <p className="text-gray-700 text-lg">
              {selectedDate
                ? selectedDate.toDateString()
                : "No date selected. Please select a date from the calendar."}
            </p>
          </div>

          {/* Time Slot Dropdown */}
          {selectedDate && (
            <div>
              <label className="block font-semibold text-blue-600 mb-2" htmlFor="timeSlot">
                Select Time Slot:
              </label>
              <select
                id="timeSlot"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 shadow-sm hover:bg-gray-50 transition-all"
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

          {/* Lecture Hall Dropdown */}
          {selectedDate && (
            <div>
              <label className="block font-semibold text-blue-600 mb-2" htmlFor="lectureHall">
                Select Lecture Hall:
              </label>
              <select
                id="lectureHall"
                value={selectedHall}
                onChange={(e) => setSelectedHall(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:ring-2 focus:ring-green-400 shadow-sm hover:bg-gray-50 transition-all"
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
          onClick={onBack}
          className="px-6 py-3 text-lg font-semibold bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
export default ReschedulePage;
