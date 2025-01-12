import React, { useContext, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const HolidaysUpload = () => {
  const [holidays, setHolidays] = useState([{ date: "", description: "" }]);
  const { url } = useContext(StoreContext);

  const handleChange = (index, field, value) => {
    const updatedHolidays = [...holidays];
    updatedHolidays[index][field] = value;
    setHolidays(updatedHolidays);
  };

  const handleAddRow = () => {
    setHolidays([...holidays, { date: "", description: "" }]);
  };

  const handleUpload = async () => {
    try {
      const response = await axios.post(`${url}/api/admin/upload-holidays`, {
        holidays,
      });

      if (response.data.status) {
        alert("Holidays uploaded successfully!");
      } else {
        alert("Failed to upload holidays.");
      }
    } catch (error) {
      console.error("Error uploading holidays:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen  mt-10">
      <div className="max-w-3xl w-full p-8 bg-yellow-50 rounded-lg shadow-lg mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Upload Holidays
        </h2>
        <div className="space-y-4">
          {holidays.map((holiday, index) => (
            <div key={index} className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <div className="flex-1">
                <input
                  type="date"
                  value={holiday.date}
                  onChange={(e) => handleChange(index, "date", e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Description"
                  value={holiday.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleAddRow}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
          >
            Add Holiday
          </button>
          <button
            onClick={handleUpload}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default HolidaysUpload;

