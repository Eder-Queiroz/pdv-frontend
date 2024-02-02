import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/authContext";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { usePathname } from "next/navigation";
import { checkIsPublicRoutes } from "@/functions/check-public-routes";
import PrivateRoute from "@/components/privateRoute";
import PublicRoute from "@/components/publicRoute";

import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();

  const isPublicPage = checkIsPublicRoutes(pathname);

  return (
    <>
      <AuthProvider>
        {isPublicPage ? (
          <PublicRoute>
            <Component {...pageProps} />
          </PublicRoute>
        ) : (
          <PrivateRoute className={`${roboto.className}`}>
            <Component {...pageProps} />
          </PrivateRoute>
        )}
        <ToastContainer autoClose={3000} />
      </AuthProvider>
    </>
  );
}
