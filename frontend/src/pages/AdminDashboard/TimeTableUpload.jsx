import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

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
  const [labs] = useState([
    "lab-1",
    "lab-2",
    "lab-3",
    "lab-4",
    "lab-5",
    "lab-6",
  ]);

  const { url } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    day_of_week: "",
    branch: "",
    semester: "",
    courses_id: "",
    start_time: new Date().setHours(8, 0, 0, 0),
    end_time: new Date().setHours(9, 0, 0, 0),
    lecture_hall_id: "",
    professor_id: "",
    class_type: "",
    group: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lectureHallsRes, professorsRes] = await Promise.all([
          axios.get(`${url}/api/admin/get-lecture-halls`),
          axios.get(`${url}/api/admin/get-professors`),
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
          setFormData({ ...formData, courses_id: "" });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStartTimeChange = (date) => {
    const startTime = date;
    let endTime;

    if (formData.class_type === "Lab") {
      endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
    } else {
      endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    }

    setFormData({ ...formData, start_time: startTime, end_time: endTime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startHour = new Date(formData.start_time).getHours();
    const endHour = new Date(formData.end_time).getHours();

    if (startHour < 8 || startHour >= 17 || endHour < 8 || endHour > 17) {
      alert("Start and End time must be between 8 AM and 5 PM.");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/admin/upload-timetable`,
        formData
      );

      if (response.data.status) {
        alert("Timetable entry added successfully!");
        setFormData({
          day_of_week: "",
          branch: "",
          semester: "",
          courses_id: "",
          start_time: new Date().setHours(8, 0, 0, 0),
          end_time: new Date().setHours(9, 0, 0, 0),
          lecture_hall_id: "",
          professor_id: "",
          class_type: "",
          group: "",
        });
        setCourses([]);
      } else {
        alert("Failed to add timetable entry.");
      }
    } catch (error) {
      console.log("Error submitting timetable entry:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const generateGroupOptions = () => {
    let groups = [];
    if (formData.class_type === "Lecture") {
      groups = ["G1", "G2"];
    } else if (
      formData.class_type === "Tutorial" ||
      formData.class_type === "Lab"
    ) {
      groups = ["G1", "G2", "G3", "G4", "G5", "G6"];
    }
    return groups;
  };

  return (
    <div className="bg-yellow-100 p-6 rounded-lg shadow-md max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Timetable Entry</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Left Side */}
        {/* Branch */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="border px-2 py-1 rounded-md w-full"
              required
            >
              <option value="" disabled>
                Select Your Branch
              </option>
              <option value="CSE">Computer Science and Engineering</option>
              <option value="CSE-DS">Computer Science and Engineering (Data Science)</option>
              <option value="CSE-AI">Computer Science and Engineering (Artificial Intelligence)</option>
              <option value="ECE">Electronics and Communication</option>
              <option value="EE">Electrical</option>
            </select>
          </div>
  
          {/* Semester */}
          <div>
            <label className="block font-medium mb-2">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="border px-2 py-1 rounded-md w-full"
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
                  {course.course_name} ({course.course_code})
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
              {professors.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Class Type */}
          <div>
            <label className="block font-medium mb-2">Class Type</label>
            <select
              name="class_type"
              value={formData.class_type}
              onChange={handleChange}
              className="border px-2 py-1 rounded-md w-full"
              required
            >
              <option value="">Select Class Type</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Lab">Lab</option>
              <option value="Lecture">Lecture</option>
            </select>
          </div>
        </div>
  
        {/* Right Side */}
        <div className="space-y-4">
          {/* Group */}
          <div>
            <label className="block font-medium mb-2">Group</label>
            <select
              name="group"
              value={formData.group}
              onChange={handleChange}
              className="border px-2 py-1 rounded-md w-full"
              required
            >
              <option value="">Select Group</option>
              {generateGroupOptions().map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
  
          {/* Day */}
          <div>
            <label className="block font-medium mb-2">Day</label>
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
  
          {/* Start Time */}
          <div>
            <label className="block font-medium mb-2">Start Time</label>
            <DatePicker
              selected={new Date(formData.start_time)}
              onChange={handleStartTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={60}
              timeCaption="Time"
              dateFormat="h:mm aa"
              minTime={new Date().setHours(8, 0, 0, 0)}
              maxTime={new Date().setHours(16, 0, 0, 0)}
              className="border px-2 py-1 rounded-md w-full"
            />
          </div>
  
          {/* End Time */}
          <div>
            <label className="block font-medium mb-2">End Time</label>
            <DatePicker
              selected={new Date(formData.end_time)}
              readOnly
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              minTime={new Date().setHours(8, 0, 0, 0)}
              maxTime={new Date().setHours(17, 0, 0, 0)}
              className="border px-2 py-1 rounded-md w-full bg-gray-200"
            />
          </div>
  
          {/* Lecture Hall/Lab */}
          <div>
            <label className="block font-medium mb-2">
              {formData.class_type === "Lab" ? "Lab" : "Lecture Hall"}
            </label>
            <select
              name={formData.class_type === "Lab" ? "lab_room" : "lecture_hall_id"}
              value={formData.class_type === "Lab" ? formData.lab_room : formData.lecture_hall_id}
              onChange={handleChange}
              className="border px-2 py-1 rounded-md w-full"
              required
            >
              <option value="">
                {formData.class_type === "Lab" ? "Select Lab" : "Select Lecture Hall"}
              </option>
              {formData.class_type === "Lab"
                ? labs.map((lab) => (
                    <option key={lab} value={lab}>
                      {lab}
                    </option>
                  ))
                : lectureHalls.map((hall) => (
                    <option key={hall.id} value={hall.id}>
                      {hall.hall_name}
                    </option>
                  ))}
            </select>
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="col-span-2 mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default TimetableUpload;
