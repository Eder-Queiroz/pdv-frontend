import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="ml-4 text-light-100">{label}</label>}
      <input
        {...props}
        className="border border-white rounded-full bg-transparent py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white"
      />
    </div>
  );
};
export { Input };
