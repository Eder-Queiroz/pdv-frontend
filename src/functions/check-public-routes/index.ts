import { APP_ROUTER } from "@/utils/constants/app-router";

export const checkIsPublicRoutes = (routeName: string): boolean => {
  const publicRoutes = Object.values(APP_ROUTER.public);

  return publicRoutes.includes(routeName);
};
