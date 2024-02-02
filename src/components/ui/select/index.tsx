import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: {
    value: string;
    label: string;
  }[];
}

const Select = ({ label, options, ...props }: SelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="ml-4">{label}</label>}
      <select
        {...props}
        className="border border-white rounded-full bg-transparent py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export { Select };
