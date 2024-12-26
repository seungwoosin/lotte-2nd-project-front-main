import axios from "axios";
import { MESSAGE_URI } from "./Message_URI";
import axiosInstance from "../../services/axios";

export const postMessage = async (data, token) => {
  try {
    const response = await axios.post(`${MESSAGE_URI}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getMessage = async (roomId) => {
  try {
    const response = await axios.get(`${MESSAGE_URI}/${roomId}`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getDeptsAndTeams = async () => {
  try {
    const depResponse = await axiosInstance.get("/api/departments");
    const teamsResponse = await axiosInstance.get("/api/teams");

    return {
      departments: depResponse.data.deps,
      teams: teamsResponse.data.teams,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // 에러를 호출한 곳에서 처리할 수 있도록 던짐
  }
};
