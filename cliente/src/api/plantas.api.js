import axios from "axios";

export const getPlantas = () => {
  return axios.get("http://localhost:8000/plantas/apiv1/plantas/");
};
