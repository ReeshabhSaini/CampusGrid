import { createContext, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");

  const [roleData, setRoleData] = useState({ role: "student" });

  const [selectedClass, setSelectedClass] = useState({});

  const url = "http://localhost:4000";

  const [studentData, setStudentData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "",
    semester: "",
    student_id: "",
  });

  const [professorData, setProfessorData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
