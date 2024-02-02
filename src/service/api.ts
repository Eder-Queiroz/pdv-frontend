import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthorizationError } from "./errors/AthorizationErro";
import { signOut } from "../context/authContext";

export const setupAPIClient = (ctx = undefined) => {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3000/",
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (typeof window === "undefined") {
          signOut();
        } else {
          return Promise.reject(new AuthorizationError());
        }

        return Promise.reject(error);
      }
    }
  );

  return api;
};
