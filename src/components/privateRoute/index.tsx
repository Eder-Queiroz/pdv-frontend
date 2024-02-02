import { useRouter } from "next/router";
import { ReactNode, useEffect, useState, AllHTMLAttributes } from "react";

import { APP_ROUTER } from "@/utils/constants/app-router";
import { checkUserAutenticated } from "@/functions/check-user-autenticated";

interface PrivateRouterProps extends AllHTMLAttributes<HTMLElement> {
  children: ReactNode;
}

const PrivateRoute = ({ children, ...rest }: PrivateRouterProps) => {
  const { push } = useRouter();

  const [isUserAutenticated, setIsUserAutenticated] = useState(false);

  useEffect(() => {
    const userAuth = checkUserAutenticated();

    setIsUserAutenticated(userAuth);

    if (!userAuth) {
      push(APP_ROUTER.public.login);
    }
  }, [isUserAutenticated, push]);

  return <div {...rest}>{isUserAutenticated ? children : null}</div>;
};

export default PrivateRoute;
