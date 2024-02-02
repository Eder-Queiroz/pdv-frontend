import { FormEvent } from "react";

export const onlyNumbers = (e: FormEvent<HTMLInputElement>) => {
  let value = e.currentTarget.value;
  value = value.replace(/\D/g, "");

  e.currentTarget.value = value;

  return e;
};

export const maskMoney = (e: FormEvent<HTMLInputElement>) => {
  let value = e.currentTarget.value;
  value = value.replace(/\D/g, "").replace(/(\d{1,2})$/, ",$1");

  e.currentTarget.value = value;

  return e;
};
