import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // Load initial student data from localStorage if available
  const [studentData, setStudentData] = useState(() => {
    const storedData = localStorage.getItem("studentData");
    return storedData
      ? JSON.parse(storedData)
      : {
          id: "",
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          confirmPassword: "",
          branch: "",
          semester: "",
          student_id: "",
        };
  });

  // Persist studentData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("studentData", JSON.stringify(studentData));
  }, [studentData]);

  const [token, setToken] = useState("");

  const [roleData, setRoleData] = useState({ role: "student" });

  const [selectedClass, setSelectedClass] = useState({});

  const url = "http://localhost:4000";

  const [professorData, setProfessorData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [rescheduleRequest, setRescheduleRequest] = useState({});

  const contextValue = {
    studentData,
    setStudentData,
    professorData,
    setProfessorData,
    roleData,
    setRoleData,
    url,
    selectedClass,
    setSelectedClass,
    token,
    setToken,
    rescheduleRequest,
    setRescheduleRequest,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
