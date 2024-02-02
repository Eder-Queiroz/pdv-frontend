import { AllHTMLAttributes, ReactNode } from "react";

interface ModalProps extends AllHTMLAttributes<HTMLDivElement> {
  open: boolean;
  close: () => void;
  children: ReactNode;
  size: any;
}

export function Modal({ open, children, close, size, ...rest }: ModalProps) {
  return (
    open && (
      <div className="fixed top-0 left-0 w-screen h-full z-50 flex justify-center items-center">
        <div
          onClick={() => close()}
          className="absolute top-0 left-0 w-full h-full glass -z-10"
        ></div>
        <div className={`${size} bg-primary-800 rounded-md shadow-lg p-6`}>
          {children}
        </div>
      </div>
    )
  );
}
