import { useState, useEffect, useCallback, FormEvent } from "react";
import {
  Wrapper,
  CardGlass,
  Button,
  ButtonOutline,
  Table,
  Pagination,
  Input,
  Select,
  Modal,
} from "@/components";
import { APP_ROUTER } from "@/utils/constants/app-router";
import ProductType from "@/utils/types/product";
import CategoryType from "@/utils/types/category";
import {
  getProducts,
  getProduct,
  createProduct,
  putProduct,
  getCategories,
  createCategory,
} from "@/service/apiClient";
import { maskMoney, onlyNumbers } from "@/functions/masks";
import { FaPencil } from "react-icons/fa6";

interface productSearchProps {
  category_id?: string;
  bar_code?: string;
  name?: string;
  limit: number;
  offset: number;
}

export default function Produtos() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [product, setProduct] = useState<ProductType>({} as ProductType);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [category_id, setCategoryId] = useState<string>("");
  const [editCategoryId, setEditCategoryId] = useState<string>("");
  const [bar_code, setBarCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [limit, setLimit] = useState<number>(6);
  const [offset, setOffset] = useState<number>(0);
  const [toggleCategory, setToggleCategory] = useState<boolean>(false);
  const [toggleProduct, setToggleProduct] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleToggleCategory = () => setToggleCategory(!toggleCategory);

  const handleToggleProduct = () => {
    setToggleProduct(!toggleProduct);
    setIsEdit(false);
    setProduct({} as ProductType);
    setEditCategoryId("");
  };

  const handleMaskMoney = useCallback((e: FormEvent<HTMLInputElement>) => {
    maskMoney(e);
  }, []);

  const handleMaskOnlyNumbers = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      onlyNumbers(e);
    },
    []
  );

  const handleGetOneProduct = async (id: number) => {
    try {
      const response = await getProduct(id);
      setProduct(response);
      setEditCategoryId(response.category?.id.toString() || "");
    } catch (error) {
      console.error("[Erro ao buscar produto]", error);
    }
  };

  const handleEdit = (id: number) => {
    setIsEdit(true);
    handleGetOneProduct(id);
    setToggleProduct(true);
  };

  const handleCreateProduct = async ({
    nameCreate,
    bar_codeCreate,
    priceCreate,
    unitCreate,
    category_idCreate,
  }: any) => {
    setLoadingBtn(true);

    try {
      await createProduct({
        name: nameCreate,
        bar_code: bar_codeCreate,
        price: priceCreate,
        unit: unitCreate,
        category_id: category_idCreate,
      });
    } catch (error) {
      console.error("[Erro ao criar produto]", error);
    } finally {
      setLoadingBtn(false);
      handleGetProducts({ bar_code, name, category_id, limit, offset });
      handleToggleProduct();
    }
  };

  const handleEditProduct = async ({
    id,
    nameCreate,
    bar_codeCreate,
    priceCreate,
    unitCreate,
    category_idCreate,
  }: any) => {
    setLoadingBtn(true);

    try {
      await putProduct({
        id,
        name: nameCreate,
        bar_code: bar_codeCreate,
        price: priceCreate,
        unit: unitCreate,
        category_id: category_idCreate,
      });
    } catch (error) {
      console.error("[Erro ao editar produto]", error);
    } finally {
      setLoadingBtn(false);
      handleGetProducts({ bar_code, name, category_id, limit, offset });
      handleToggleProduct();
    }
  };

  const handleSubmitProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameCreate = (e.currentTarget[0] as HTMLInputElement).value;
    const bar_codeCreate = (e.currentTarget[1] as HTMLInputElement).value;
    const priceCreate = (e.currentTarget[2] as HTMLInputElement).value.replace(
      ",",
      "."
    );
    const unitCreate = (e.currentTarget[3] as HTMLInputElement).value;
    const category_idCreate = (e.currentTarget[4] as HTMLInputElement).value;

    if (isEdit)
      handleEditProduct({
        id: product.id,
        nameCreate,
        bar_codeCreate,
        priceCreate,
        unitCreate,
        category_idCreate,
      });
    else
      handleCreateProduct({
        nameCreate,
        bar_codeCreate,
        priceCreate,
        unitCreate,
        category_idCreate,
      });
  };

  const handleCreateCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (e.currentTarget[0] as HTMLInputElement).value;

    setLoadingBtn(true);
    try {
      await createCategory({ name });
    } catch (error) {
      console.error("[Erro ao criar categoria]", error);
    } finally {
      setLoadingBtn(false);
      handleGetCategories();
      handleToggleCategory();
    }
  };

  const handleGetCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("[Erro ao buscar categorias]", error);
    }
  };

  const handleGetProducts = async ({
    bar_code,
    name,
    category_id,
    limit,
    offset,
  }: productSearchProps) => {
    setLoading(true);
    try {
      const { count, rows } = await getProducts({
        category_id,
        bar_code,
        name,
        limit,
        offset,
      });
      setProducts(rows);
      setTotalProducts(count);
    } catch (error) {
      console.error("[Erro ao buscar produtos]", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCategories();
    handleGetProducts({ bar_code, name, category_id, limit, offset });
  }, []);

  const handleSetPage = (offset: number, limit: number) => {
    setOffset(offset);
    setLimit(limit);
    handleGetProducts({ limit, offset });
  };

  const columns = [
    {
      key: "name",
      label: "Nome",
    },
    {
      key: "bar_code",
      label: "Código de Barras",
    },
    {
      key: "price",
      label: "Preço",
    },
    {
      key: "unit",
      label: "Unidades em estoque",
    },
    {
      key: "category.name",
      label: "Categoria",
    },
    {
      key: "edit",
      label: "",
    },
  ];

  const data = loading
    ? [
        {
          name: (
            <div className="w-[160px] animate-pulse flex m-auto p-2">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          bar_code: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          price: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          unit: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          "category.name": (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
        },
      ]
    : products.map((product) => ({
        name: product.name,
        bar_code: product.bar_code,
        price: "R$ " + product.price,
        unit: product.unit,
        "category.name": product.category.name,
        edit: (
          <div className="px-4 flex items-center justify-center">
            <FaPencil
              className="cursor-pointer"
              onClick={() => handleEdit(product.id)}
            />
          </div>
        ),
      }));

  const options = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  options.unshift({
    value: "",
    label: "Todas",
  });

  return (
    <Wrapper title="Turno" pathname={APP_ROUTER.private.produtos.name}>
      <CardGlass
        style={{
          minHeight: "calc(100vh - 60px)",
        }}
      >
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">Produtos</h2>
              <span className="text-lg text-light-400">
                Gerencie seus produtos.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ButtonOutline
                bgColor="hover:bg-primary-100"
                textColor="text-primary-100"
                borderColor="border-primary-100"
                hoverTextColor="hover:text-black"
                onClick={() => handleToggleCategory()}
              >
                Criar categoria
              </ButtonOutline>
              <ButtonOutline
                bgColor="hover:bg-secondary-500"
                textColor="text-secondary-500"
                borderColor="border-secondary-500"
                onClick={() => handleToggleProduct()}
              >
                Criar produto
              </ButtonOutline>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-end gap-4">
              <Input
                label="Nome"
                type="text"
                placeholder="Ex: Coca-Cola"
                style={{
                  marginBottom: "1.5rem",
                }}
                onChange={(e) => {
                  setName(e.target.value);
                  handleGetProducts({
                    name: e.target.value,
                    bar_code,
                    category_id,
                    limit,
                    offset,
                  });
                }}
              />
              <Input
                label="código de barras"
                type="text"
                placeholder="Ex: 7894900011517"
                style={{
                  marginBottom: "1.5rem",
                }}
                onChange={(e) => {
                  setBarCode(e.target.value);
                  handleGetProducts({
                    bar_code: e.target.value,
                    name,
                    category_id,
                    limit,
                    offset,
                  });
                }}
              />
              <Select
                label="Categoria"
                defaultValue={""}
                options={options}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  handleGetProducts({
                    bar_code,
                    name,
                    category_id: e.target.value,
                    limit,
                    offset,
                  });
                }}
                style={{
                  marginBottom: "1.5rem",
                }}
              />
            </div>
            <Table columns={columns} data={data} />
            <Pagination
              limit={limit}
              page={offset}
              total={totalProducts}
              setPage={handleSetPage}
            />
          </div>
        </div>
      </CardGlass>

      <Modal open={toggleCategory} close={handleToggleCategory} size={"w-1/2"}>
        <h2 className="text-2xl font-bold text-light-100">Criar categoria</h2>
        <span className="text-md text-light-400">
          Informe o nome da nova categoria.
        </span>
        <form onSubmit={handleCreateCategory}>
          <Input
            type="text"
            placeholder="Ex: Bebidas"
            style={{
              marginTop: "1.5rem",
            }}
          />
          <div className="flex justify-end gap-4 mt-6">
            <Button color="primary" onClick={() => handleToggleCategory()}>
              Cancelar
            </Button>
            <Button type="submit" color="secondary" loading={loadingBtn}>
              Criar categoria
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={toggleProduct} close={handleToggleProduct} size={"w-1/2"}>
        <h2 className="text-2xl font-bold text-light-100">
          {isEdit ? "Editar produto" : "Criar produto"}
        </h2>
        <span className="text-md text-light-400">
          {isEdit
            ? "Edite as informações do produto."
            : "Informe os dados do novo produto."}
        </span>
        <form
          onSubmit={handleSubmitProduct}
          className="mt-6 grid grid-cols-2 gap-4 text-light-100"
        >
          <Input
            label="Nome"
            type="text"
            placeholder="Ex: Coca-Cola 1L"
            defaultValue={product.name}
          />
          <Input
            label="Codigo de barras"
            type="text"
            placeholder="Ex: 7894900011517"
            onChange={handleMaskOnlyNumbers}
            defaultValue={product.bar_code}
          />
          <Input
            label="Preço"
            type="text"
            placeholder="Ex: 5.00"
            onChange={handleMaskMoney}
            defaultValue={product.price}
          />
          <Input
            label="Unidades em estoque"
            type="text"
            placeholder="Ex: 10"
            onChange={handleMaskOnlyNumbers}
            defaultValue={product.unit}
          />
          <div className="col-span-2">
            <Select
              label="Categoria"
              value={editCategoryId || "1"}
              onChange={(e) => {
                setEditCategoryId(e.target.value);
              }}
              options={options.length > 0 ? options.slice(1) : []}
              style={{
                marginBottom: "1.5rem",
              }}
            />
          </div>
          <div className="flex justify-end gap-4 mt-6 col-span-2">
            <Button color="primary" onClick={() => handleToggleProduct()}>
              Cancelar
            </Button>
            <Button type="submit" color="secondary" loading={loadingBtn}>
              {isEdit ? "Editar produto" : "Criar produto"}
            </Button>
          </div>
        </form>
      </Modal>
    </Wrapper>
  );
}
