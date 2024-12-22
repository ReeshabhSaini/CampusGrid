import React, { useState } from "react";

const ReschedulePage = ({ event, onBack }) => {
  const [newDate, setNewDate] = useState(event?.start || new Date());
  const [newStartTime, setNewStartTime] = useState(event?.start || new Date());
  const [newEndTime, setNewEndTime] = useState(event?.end || new Date());

  const handleReschedule = () => {
    // Here you would send updated details to your backend or API
    console.log("Rescheduling event:", {
      id: event.id,
      newDate,
      newStartTime,
      newEndTime,
    });

    alert(`Event "${event.title}" rescheduled successfully!`);
    onBack(); // Go back to the timetable
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reschedule Event</h2>
      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
        {/* Event Details */}
        <div>
          <h3 className="font-semibold">Event Details:</h3>
          <p className="text-gray-700">
            <strong>Title:</strong> {event.title}
          </p>
          <p className="text-gray-700">
            <strong>Current Date & Time:</strong>{" "}
            {`${event.start.toLocaleString()} - ${event.end.toLocaleString()}`}
          </p>
        </div>

        {/* New Date Selection */}
        <div>
          <label className="block font-semibold mb-2" htmlFor="newDate">
            Select New Date:
          </label>
          <input
            type="date"
            id="newDate"
            value={newDate.toISOString().split("T")[0]}
            onChange={(e) => setNewDate(new Date(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* New Time Selection */}
        <div className="flex space-x-4">
          <div>
            <label className="block font-semibold mb-2" htmlFor="newStartTime">
              Start Time:
            </label>
            <input
              type="time"
              id="newStartTime"
              value={newStartTime.toTimeString().slice(0, 5)}
              onChange={(e) =>
                setNewStartTime(
                  new Date(
                    newDate.getFullYear(),
                    newDate.getMonth(),
                    newDate.getDate(),
                    ...e.target.value.split(":")
                  )
                )
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2" htmlFor="newEndTime">
              End Time:
            </label>
            <input
              type="time"
              id="newEndTime"
              value={newEndTime.toTimeString().slice(0, 5)}
              onChange={(e) =>
                setNewEndTime(
                  new Date(
                    newDate.getFullYear(),
                    newDate.getMonth(),
                    newDate.getDate(),
                    ...e.target.value.split(":")
                  )
                )
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={handleReschedule}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
    </div>
  );
};

export default ReschedulePage;
