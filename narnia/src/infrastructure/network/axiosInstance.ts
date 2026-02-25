import axios from "axios";
import { getEnvironment } from "@/infrastructure/config/environment";

const environment = getEnvironment();

export const axiosInstance = axios.create({
  baseURL: environment.bffBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});
