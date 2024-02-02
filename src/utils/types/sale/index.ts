import ProductType from "../product";
import ShiftType from "../shift";

type SaleType = {
  id: number;
  quantity: number;
  payment_method: "money" | "credit" | "debit";
  sale_time: string;
  product: ProductType;
  shift: ShiftType;
};

export default SaleType;
