import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const BASE_URL = "http://localhost:8080";

const useAxios = () => {
  const accessToken = localStorage.getItem("accessToken");
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });
  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwtDecode(accessToken);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    const response = await axios.post(
      "http://localhost:8080/refresh-token", {
        refreshToken: localStorage.getItem("refreshToken"),
      }
    );
    const newToken = response.data.data.access_token;

    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("refreshToken", response.data.data.refresh_token);

    req.headers.Authorization = `Bearer ${newToken}`;

    return req;
  });

  return axiosInstance;
};

export default useAxios;
