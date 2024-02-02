import { setupAPIClient } from "./api";
import { SerializeError } from "./errors/SerializeError";
import { parseCookies } from "nookies";

const getCookie = () => {
  const { "@nextauth.token": authToken } = parseCookies();

  return "Bearer " + authToken;
};

export const api = setupAPIClient();

export const login = async ({ name, password }: any) => {
  try {
    const { data } = await api.post("/login", {
      name,
      password,
    });

    return data;
  } catch (error) {
    throw new SerializeError("Error on login", error);
  }
};

export const singIn = async ({ name, password, role }: any) => {
  try {
    const config = {
      headers: {
        Authorization: getCookie(),
      },
    };
    const { status } = await api.post(
      "/register",
      {
        name,
        password,
        role,
      },
      config
    );

    return status;
  } catch (error) {
    throw new SerializeError("Error on singIn", error);
  }
};

export const getMe = async (token: string) => {
  try {
    const { data } = await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    throw new SerializeError("Error on getMe", error);
  }
};

export const getUsers = async ({ limit, offset }: any) => {
  try {
    const { data } = await api.get("/users", {
      params: {
        limit,
        offset: offset != 0 ? offset * limit - limit : offset,
      },
      headers: {
        Authorization: getCookie(),
      },
    });

    return data;
  } catch (error) {
    throw new SerializeError("Error on getUsers", error);
  }
};

export const getShits = async ({
  start_time,
  end_time,
  is_opened,
  limit,
  offset,
}: any) => {
  try {
    const { data } = await api.get("/shift", {
      params: {
        start_time,
        end_time,
        is_opened,
        limit,
        offset: offset != 0 ? offset * limit - limit : offset,
      },
    });

    return data;
  } catch (error) {
    throw new SerializeError("Error on getShits", error);
  }
};

export const getShiftByUserId = async () => {
  try {
    const config = {
      headers: {
        Authorization: getCookie(),
      },
    };

    const { data } = await api.get("/shift/user", config);

    return data;
  } catch (error) {
    throw new SerializeError("Error on getShiftByUserId", error);
  }
};

export const openShift = async ({ start_cash }: any) => {
  try {
    const config = {
      headers: {
        Authorization: getCookie(),
      },
    };

    const { data } = await api.post(
      "/shift",
      {
        start_cash,
      },
      config
    );

    return data;
  } catch (error) {
    throw new SerializeError("Error on openShift", error);
  }
};

export const closeShift = async ({ end_cash }: any) => {
  try {
    const config = {
      headers: {
        Authorization: getCookie(),
      },
    };

    const { data } = await api.put(
      "/shift",
      {
        end_cash,
      },
      config
    );

    return data;
  } catch (error) {
    throw new SerializeError("Error on closeShift", error);
  }
};

export const getCategories = async () => {
  try {
    const { data } = await api.get("/category");

    return data;
  } catch (error) {
    throw new SerializeError("Error on getCategories", error);
  }
};

export const createCategory = async ({ name }: any) => {
  try {
    const config = {
      headers: {
        Authorization: getCookie(),
      },
    };

    const { data } = await api.post(
      "/category",
      {
        name,
      },
      config
    );

    return data;
  } catch (error) {
    throw new SerializeError("Error on createCategory", error);
  }
};

export const getProducts = async ({
  category_id,
  bar_code,
  name,
  limit,
  offset,
}: any) => {
  try {
    const { data } = await api.get("/product", {
      params: {
        category_id,
        bar_code,
        name,
        limit,
        offset: offset != 0 ? offset * limit - limit : offset,
      },
    });

    return data;
  } catch (error) {
    throw new SerializeError("Error on getProducts", error);
  }
};

export const getProduct = async (id: number) => {
  try {
    const { data } = await api.get(`/product/${id}`);

    return data;
  } catch (error) {
    throw new SerializeError("Error on getProduct", error);
  }
};

export const getProductByBarCode = async (bar_code: string) => {
  try {
    const { data } = await api.get(`/product/barcode/${bar_code}`);

    return data;
  } catch (error) {
    throw new SerializeError("Error on getProductByBarCode", error);
  }
};

export const createProduct = async ({
  name,
  bar_code,
  price,
  unit,
  category_id,
}: any) => {
  try {
    const config = {
      headers: {
        Authorization: getCookie(),
      },
    };

    const { data } = await api.post(
      "/product",
      {
        name,
        bar_code,
        price,
        unit,
        category_id,
      },
      config
    );

    return data;
  } catch (error) {
    throw new SerializeError("Error on createProduct", error);
  }
};

export const putProduct = async ({
  id,
  name,
  bar_code,
  price,
  unit,
  category_id,
}: any) => {
  try {
    const config = {
      headers: {
        Authorization: getCookie(),
      },
    };

    const { data } = await api.put(
      `/product`,
      {
        id,
        name,
        bar_code,
        price,
        unit,
        category_id,
      },
      config
    );

    return data;
  } catch (error) {
    throw new SerializeError("Error on putProduct", error);
  }
};

export const getSales = async ({
  payment_method,
  start_sale_time,
  end_sale_time,
  limit,
  offset,
}: any) => {
  try {
    const { data } = await api.get("/sale", {
      params: {
        payment_method,
        start_sale_time,
        end_sale_time,
        limit,
        offset: offset != 0 ? offset * limit - limit : offset,
      },
    });

    return data;
  } catch (error) {
    throw new SerializeError("Error on getSales", error);
  }
};

export const registerSale = async ({
  shift_id,
  product_id,
  quantity,
  payment_method,
}: any) => {
  try {
    const config = {
      headers: {
        Authorization: getCookie(),
      },
    };

    const { data } = await api.post(
      "/sale",
      {
        shift_id,
        product_id,
        quantity,
        payment_method,
      },
      config
    );

    return data;
  } catch (error) {
    throw new SerializeError("Error on registerSale", error);
  }
};

export const registerChanged = async ({ shift_id, value }: any) => {
  try {
    const config = {
      headers: {
        Authorization: getCookie(),
      },
    };

    const { data } = await api.post(
      "/changed",
      {
        shift_id,
        value,
      },
      config
    );

    return data;
  } catch (error) {
    throw new SerializeError("Error on registerChange", error);
  }
};
