import { parseCookies } from "nookies";

export const checkUserAutenticated = (): boolean => {
  const cookies = parseCookies();
  const token = cookies["@nextauth.token"];

  return !!token;
};
