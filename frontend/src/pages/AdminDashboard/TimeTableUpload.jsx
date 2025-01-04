import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

function capitalizeFirstLetter(string) {
  if (!string) return ""; // Handle empty or undefined strings
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const TimetableUpload = () => {
  const [daysOfWeek] = useState([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ]);
  const [courses, setCourses] = useState([]);
  const [lectureHalls, setLectureHalls] = useState([]);
  const [professors, setProfessors] = useState([]);

  const { url } = useContext(StoreContext);

  // Form State
  const [formData, setFormData] = useState({
    day_of_week: "",
    courses_id: "",
    start_time: "",
    end_time: "",
    lecture_hall_id: "",
    professor_id: "",
  });

  // Fetch dropdown data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, lectureHallsRes, professorsRes] = await Promise.all([
          axios.get(`${url}/api/admin/get-courses`), // API to fetch all courses
          axios.get(`${url}/api/admin/get-lecture-halls`), // API to fetch all lecture halls
          axios.get(`${url}/api/admin/get-professors`), // API to fetch all professors
        ]);

        setCourses(coursesRes.data.data);
        setLectureHalls(lectureHallsRes.data.data);
        setProfessors(professorsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${url}/api/admin/upload-timetable`,
        formData
      );

      if (response.data.status) {
        alert("Timetable entry added successfully!");
        // Reset form after successful submission
        setFormData({
          day_of_week: "",
          courses_id: "",
          start_time: "",
          end_time: "",
          lecture_hall_id: "",
          professor_id: "",
        });
      } else {
        alert("Failed to add timetable entry.");
      }
    } catch (error) {
      console.log("Error submitting timetable entry:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Timetable Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Day of the Week */}
        <div>
          <label className="block font-medium mb-2">Day of the Week</label>
          <select
            name="day_of_week"
            value={formData.day_of_week}
            onChange={handleChange}
            className="border px-2 py-1 rounded-md w-full"
            required
          >
            <option value="">Select Day</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {capitalizeFirstLetter(day)}
              </option>
            ))}
          </select>
        </div>

        {/* Course */}
        <div>
          <label className="block font-medium mb-2">Course</label>
          <select
            name="courses_id"
            value={formData.courses_id}
            onChange={handleChange}
            className="border px-2 py-1 rounded-md w-full"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name} ({course.course_code}) - {course.branch},{" "}
                Semester {course.semester}
              </option>
            ))}
          </select>
        </div>

        {/* Start Time */}
        <div>
          <label className="block font-medium mb-2">Start Time</label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className="border px-2 py-1 rounded-md w-full"
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block font-medium mb-2">End Time</label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            className="border px-2 py-1 rounded-md w-full"
            required
          />
        </div>

        {/* Lecture Hall */}
        <div>
          <label className="block font-medium mb-2">Lecture Hall</label>
          <select
            name="lecture_hall_id"
            value={formData.lecture_hall_id}
            onChange={handleChange}
            className="border px-2 py-1 rounded-md w-full"
            required
          >
            <option value="">Select Lecture Hall</option>
            {lectureHalls.map((hall) => (
              <option key={hall.id} value={hall.id}>
                {hall.hall_name}
              </option>
            ))}
          </select>
        </div>

        {/* Professor */}
        <div>
          <label className="block font-medium mb-2">Professor</label>
          <select
            name="professor_id"
            value={formData.professor_id}
            onChange={handleChange}
            className="border px-2 py-1 rounded-md w-full"
            required
          >
            <option value="">Select Professor</option>
            {professors.map((professor) => (
              <option key={professor.id} value={professor.id}>
                {professor.first_name} {professor.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Timetable Entry
        </button>
      </form>
    </div>
  );
};

export default TimetableUpload;
