import { ReactNode, LiHTMLAttributes } from "react";

interface NavItemProps extends LiHTMLAttributes<HTMLElement> {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export const NavItem = ({
  children,
  active,
  disabled,
  ...rest
}: NavItemProps) => {
  return (
    <li
      {...rest}
      className={`w-full h-10 rounded-md cursor-pointer mb-4 text-light-100 ${
        active ? "bg-secondary-500 font-bold shadow-md" : "hover:bg-primary-500"
      } ${disabled && "opacity-50 cursor-not-allowed bg-primary-400"}`}
    >
      {children}
    </li>
  );
};
