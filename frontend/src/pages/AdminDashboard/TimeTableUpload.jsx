import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

function capitalizeFirstLetter(string) {
  if (!string) return "";
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
  const [groups, setGroups] = useState([]);

  const { url } = useContext(StoreContext);

  // Form State
  const [formData, setFormData] = useState({
    day_of_week: "",
    branch: "",
    semester: "",
    type: "",
    group: "",
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
        const [lectureHallsRes, professorsRes] = await Promise.all([
          axios.get(`${url}/api/admin/get-lecture-halls`), // API to fetch all lecture halls
          axios.get(`${url}/api/admin/get-professors`), // API to fetch all professors
        ]);

        setLectureHalls(lectureHallsRes.data.data);
        setProfessors(professorsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  // Fetch courses when semester is selected
  useEffect(() => {
    if (formData.branch && formData.semester) {
      const fetchCourses = async () => {
        try {
          const branch = formData.branch;
          const semester = formData.semester;
          const response = await axios.post(`${url}/api/admin/get-courses`, {
            branch,
            semester,
          });
          setCourses(response.data.data);
          setFormData({ ...formData, courses_id: "" }); // Reset course
        } catch (error) {
          console.error("Error fetching courses:", error);
          alert("Failed to load courses. Please try again.");
        }
      };

      fetchCourses();
    } else {
      setCourses([]);
    }
  }, [formData.branch, formData.semester]);

  // Update groups based on type
  useEffect(() => {
    if (formData.type === "class") {
      setGroups(["G1", "G2"]);
    } else if (formData.type === "tutorial") {
      setGroups(["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"]);
    } else if (formData.type === "lab") {
      setGroups(["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"]);
    } else {
      setGroups([]);
    }
  }, [formData.type]);

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
          branch: "",
          semester: "",
          courses_id: "",
          type: "",
          group: "",
          start_time: "",
          end_time: "",
          lecture_hall_id: "",
          professor_id: "",
        });
        setCourses([]);
        setGroups([]);
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
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Day of the Week
          </label>
          <select
            name="day_of_week"
            value={formData.day_of_week}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
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

        {/* Branch */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Branch
          </label>
          <select
            name="branch"
            onChange={handleChange}
            value={formData.branch}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Your Branch
            </option>
            <option value="CSE">Computer Science and Engineering</option>
            <option value="CSE-DS">
              Computer Science and Engineering (Data Science)
            </option>
            <option value="CSE-AI">
              Computer Science and Engineering (Artificial Intelligence)
            </option>
            <option value="ECE">
              Electronics and Communication Engineering
            </option>
            <option value="EE">Electrical Engineering</option>
            <option value="Mech">Mechanical Engineering</option>
            <option value="Civil">Civil Engineering</option>
            <option value="Civil">Aerospace Engineering</option>
            <option value="Meta">
              Metallurgical and Materials Engineering
            </option>
            <option value="Prod">Production and Industrial Engineering</option>
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Semester
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Semester
            </option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
            <option value="4">4th</option>
            <option value="5">5th</option>
            <option value="6">6th</option>
            <option value="7">7th</option>
            <option value="8">8th</option>
          </select>
        </div>

        {/* Course */}
        <div>
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Course
          </label>
          <select
            name="courses_id"
            value={formData.courses_id}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name} ({course.course_code})
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Select Entry Type
          </label>
          <select
            name="type"
            onChange={handleChange}
            value={formData.type}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Entry Type
            </option>
            <option value="class">Class</option>
            <option value="tutorial">Tutorial</option>
            <option value="lab">Lab</option>
          </select>
        </div>

        {/* Group */}
        <div>
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Group
          </label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          >
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {/* Start Time */}
        <div>
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Start Time
          </label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            End Time
          </label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          />
        </div>

        {/* Lecture Hall */}
        <div>
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Lecture Hall
          </label>
          <select
            name="lecture_hall_id"
            value={formData.lecture_hall_id}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
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
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Professor
          </label>
          <select
            name="professor_id"
            value={formData.professor_id}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
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
          className="w-full py-3 mb-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Add Timetable Entry
        </button>
      </form>
    </div>
  );
};

export default TimetableUpload;
