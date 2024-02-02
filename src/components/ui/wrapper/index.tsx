import { AllHTMLAttributes, ReactNode } from "react";
import Head from "next/head";
import { Sidebar } from "@/components";

interface WrapperProps extends AllHTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title: string;
  pathname: string;
}

const Wrapper = ({ children, title, pathname, ...rest }: WrapperProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main
        {...rest}
        className={`w-screen min-h-screen bg-primary-800 relative`}
      >
        <div className="flex h-full relative z-10">
          <Sidebar pathName={pathname} />
          <div className={"w-full px-6 py-9"}>{children}</div>
        </div>
        <div className="absolute bottom-0">
          <img src="vector.svg" alt="vetor" />
        </div>
      </main>
    </>
  );
};

export { Wrapper };
