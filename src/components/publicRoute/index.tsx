import { ReactNode, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import Router from "next/router";
import { APP_ROUTER } from "@/utils/constants/app-router";

import { checkUserAutenticated } from "@/functions/check-user-autenticated";

type PrivateRouterProps = {
  children: ReactNode;
};

const PublicRoute = ({ children }: PrivateRouterProps) => {
  const { userData } = useAuth();
  const [isUserAutenticated, setIsUserAutenticated] = useState(false);

  useEffect(() => {
    const userAuth = checkUserAutenticated();

    setIsUserAutenticated(userAuth);

    if (userAuth) {
      Router.push(APP_ROUTER.private.turno.name);
    }
  }, [userData]);

  return <>{!isUserAutenticated ? children : null}</>;
};

export default PublicRoute;
