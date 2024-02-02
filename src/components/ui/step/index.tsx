import { AllHTMLAttributes } from "react";
import { FaCashRegister, FaDollarSign, FaCircleCheck } from "react-icons/fa6";

interface StepProps extends AllHTMLAttributes<HTMLElement> {
  step: number;
}

export const Step = ({ step, ...rest }: StepProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mx-auto" {...rest}>
      <div
        className={`p-1 ${
          step >= 1 ? "text-secondary-500" : "text-primary-200"
        } flex flex-col items-center font-bold`}
      >
        <FaCashRegister
          size={24}
          className={step >= 1 ? "fill-secondary-500" : "fill-primary-200"}
        />
        <span>Caixa</span>
      </div>
      <div
        className={`w-24 h-2 rounded-full ${
          step >= 1 ? "bg-secondary-500" : "bg-primary-200"
        }`}
      ></div>
      <div
        className={`p-1 ${
          step >= 2 ? "text-secondary-500" : "text-primary-200"
        } flex flex-col items-center font-bold`}
      >
        <FaDollarSign
          size={24}
          className={step >= 2 ? "fill-secondary-500" : "fill-primary-200"}
        />
        <span>Venda</span>
      </div>
      <div
        className={`w-24 h-2 rounded-full ${
          step >= 2 ? "bg-secondary-500" : "bg-primary-200"
        }`}
      ></div>
      <div
        className={`p-1 ${
          step >= 3 ? "text-secondary-500" : "text-primary-200"
        } flex flex-col items-center font-bold`}
      >
        <FaCircleCheck
          size={24}
          className={step >= 3 ? "fill-secondary-500" : "fill-primary-200"}
        />
        <span>Finalizar</span>
      </div>
    </div>
  );
};
