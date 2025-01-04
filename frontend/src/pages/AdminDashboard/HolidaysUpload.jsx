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
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Holidays</h2>
      {holidays.map((holiday, index) => (
        <div key={index} className="mb-2 flex gap-2">
          <input
            type="date"
            value={holiday.date}
            onChange={(e) => handleChange(index, "date", e.target.value)}
            className="border px-2 py-1 rounded-md"
          />
          <input
            type="text"
            placeholder="Description"
            value={holiday.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
            className="border px-2 py-1 rounded-md"
          />
        </div>
      ))}
      <button
        onClick={handleAddRow}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
      >
        Add Holiday
      </button>
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Upload
      </button>
    </div>
  );
};

export default HolidaysUpload;
