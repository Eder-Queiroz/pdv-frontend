import { AllHTMLAttributes } from "react";

interface CardProps extends AllHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = ({ children, ...props }: CardProps) => {
  return (
    <div
      className="p-4 shadow-md shadow-zinc-800 rounded bg-primary-500 text-white"
      {...props}
    >
      {children}
    </div>
  );
};

const CardGlass = ({ children, ...props }: CardProps) => {
  return (
    <div className="p-4 rounded text-white glass" {...props}>
      {children}
    </div>
  );
};

export { Card, CardGlass };
