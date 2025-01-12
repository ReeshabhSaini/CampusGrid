import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [studentData, setStudentData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    branch: "",
    semester: "",
    class_group: "",
    lab_group: "",
    tutorial_group: "",
    student_id: "",
  });

  const [token, setToken] = useState("");

  const [roleData, setRoleData] = useState({ role: "student" });

  const [selectedClass, setSelectedClass] = useState({});

  const url = "http://localhost:4000";

  const [professorData, setProfessorData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
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
