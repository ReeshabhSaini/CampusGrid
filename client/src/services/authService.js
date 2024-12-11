import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password });
};

export const register = async (data) => {
    return axios.post(`${API_URL}/register`, data);
};
