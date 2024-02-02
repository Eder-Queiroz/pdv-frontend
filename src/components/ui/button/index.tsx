import { ButtonHTMLAttributes } from "react";
import { ImSpinner2 } from "react-icons/im";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color: string;
  loading?: boolean;
}

interface ButtonOutlineProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  borderColor: string;
  bgColor: string;
  textColor: string;
  hoverTextColor?: string;
}

const Button = ({ children, color, loading, ...rest }: ButtonProps) => {
  return (
    <button
      className={`text-white bg-${color}-500 hover:bg-${color}-600 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-4 py-2 text-sm font-medium cursor-pointer ${
        loading
          ? "opacity-50 cursor-not-allowed flex justify-center items-center min-w-24"
          : ""
      }`}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <ImSpinner2 size={18} className="animate-spin"></ImSpinner2>
      ) : (
        children
      )}
    </button>
  );
};

const ButtonOutline = ({
  children,
  borderColor,
  bgColor,
  textColor,
  hoverTextColor,
  ...rest
}: ButtonOutlineProps) => {
  return (
    <button
      className={`${textColor} bg-transparent border ${borderColor} ${bgColor} ${
        hoverTextColor ? hoverTextColor : "hover:text-light-100"
      } focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-4 py-2 text-sm font-medium cursor-pointer`}
      {...rest}
    >
      {children}
    </button>
  );
};

export { Button, ButtonOutline };
