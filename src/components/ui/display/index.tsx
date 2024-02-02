import { AllHTMLAttributes } from "react";

interface DisplayProps extends AllHTMLAttributes<HTMLElement> {
  value: string;
}

export const Display = ({ value, ...props }: DisplayProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full bg-gray-800 rounded-xl p-8 shadow-md border-2 border-gray-700"
      {...props}
    >
      <span className="text-4xl font-bold text-white">{value}</span>
    </div>
  );
};
