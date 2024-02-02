import CategoryType from "../category";

type ProductType = {
  id: number;
  bar_code: string;
  name: string;
  price: number;
  unit: number;
  category: CategoryType;
};

export default ProductType;
