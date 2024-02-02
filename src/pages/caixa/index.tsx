import { useState, useEffect, useCallback, FormEvent } from "react";
import useAuth from "@/hooks/useAuth";
import {
  Wrapper,
  CardGlass,
  Step,
  Input,
  Display,
  Table,
  Button,
  Select,
  Modal,
} from "@/components";
import { APP_ROUTER } from "@/utils/constants/app-router";
import ProductType from "@/utils/types/product";
import Router from "next/router";
import { toast } from "react-toastify";
import { onlyNumbers, maskMoney } from "@/functions/masks";
import {
  getProductByBarCode,
  registerSale,
  getShiftByUserId,
  registerChanged,
} from "@/service/apiClient";
import { IoAdd } from "react-icons/io5";
import {
  FaTrashCan,
  FaMoneyBill,
  FaCreditCard,
  FaMoneyCheck,
  FaPix,
} from "react-icons/fa6";

interface ProductListProps {
  products: ProductType;
  quantity: number;
  total: number;
}

interface SaleProps {
  shift_id: number;
  product_id: number;
  quantity: number;
  payment_method: string;
}

export default function Caixa() {
  const {
    userData: { is_opened },
  } = useAuth();

  if (!is_opened) {
    toast.error("Você precisa iniciar um turno para usar o caixa.");
    Router.push(APP_ROUTER.private.turno.name);
  }

  const [products, setProducts] = useState<ProductListProps[]>([]);
  const [totalPrice, setTotalPrice] = useState("0,00");
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("money");
  const [valueReceived, setValueReceived] = useState("0,00");
  const [toggle, setToggle] = useState(false);
  const [typeOperation, setTypeOperation] = useState("reinforcement");

  const handleToggle = () => setToggle(!toggle);

  const handleRegisterChanged = async ({ shift_id, value }: any) => {
    try {
      await registerChanged({ shift_id, value });
    } catch (error) {
      console.error("[Error handleRegisterChanged]", error);
    }
  };

  const handleGetShift = async () => {
    try {
      const shift = await getShiftByUserId();
      return shift;
    } catch (error) {
      console.error("[Error handleGetShift]", error);
    }
  };

  const handleSubmitChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingBtn(true);
    let value = parseFloat(e.currentTarget.valueChanged.value);
    if (typeOperation == "sangria") {
      value = -value;
    }
    try {
      const { id } = await handleGetShift();
      await handleRegisterChanged({ shift_id: id, value });
      toast.success("Operação realizada com sucesso!");
    } catch (error) {
      console.error("[Error handleSubmitChange]", error);
      toast.error("Erro ao realizar operação.");
    } finally {
      setToggle(false);
      setLoadingBtn(false);
    }
  };

  const handleRegisterSale = async ({
    shift_id,
    product_id,
    quantity,
    payment_method,
  }: SaleProps) => {
    try {
      await registerSale({ shift_id, product_id, quantity, payment_method });
    } catch (error) {
      console.error("[Error handleRegisterSale]", error);
    }
  };

  const handleFinishSale = async () => {
    setLoading(true);
    try {
      const { id } = await handleGetShift();
      console.log(id);
      products.map(async (product) => {
        await handleRegisterSale({
          shift_id: id,
          product_id: product.products.id,
          quantity: product.quantity,
          payment_method: paymentMethod,
        });
      });
      toast.success("Venda realizada com sucesso!");
    } catch (error) {
      console.error("[Error handleFinishSale]", error);
      toast.error("Erro ao finalizar venda.");
    } finally {
      setLoading(false);
      setProducts([]);
      setTotalPrice("0,00");
      setPaymentMethod("money");
      setValueReceived("0,00");
      setCurrentStep(1);
    }
  };

  const handleTotalPrice = () => {
    let total: number = 0;
    products.map((product) => {
      total = total + parseFloat(product.total.toString());
    });

    setTotalPrice(parseFloat(total.toString()).toFixed(2).replace(".", ","));
  };

  const handleMoneyChange = (e: FormEvent<HTMLInputElement>) => {
    const value = parseFloat(e.currentTarget.value.replace(",", "."));

    const price = parseFloat(totalPrice.replace(",", "."));

    const received = value - price;

    setValueReceived(
      parseFloat(received.toString()).toFixed(2).replace(".", ",")
    );
  };

  const handleAddProduct = async (bar_code: string) => {
    try {
      const product = await getProductByBarCode(bar_code);
      if (products.find((item) => item.products.id === product.id)) {
        let changeProduct = [...products];

        changeProduct.map((item) => {
          if (item.products.id === product.id) {
            item.quantity += 1;
            item.total = product.price * item.quantity;
          }
        });

        setProducts(changeProduct);
      } else {
        const serializedProduct = {
          products: product,
          quantity: 1,
          total: product.price,
        };

        setProducts((prev) => [...prev, serializedProduct]);
      }
    } catch (error) {
      console.error("[Error handleAddProduct]", error);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const bar_code = e.currentTarget.bar_code.value;
    handleAddProduct(bar_code);
  };

  useEffect(() => {
    handleTotalPrice();
  }, [products]);

  const handleMaskOnlyNumbers = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      onlyNumbers(e);
    },
    []
  );

  const handleMaskMoney = useCallback((e: FormEvent<HTMLInputElement>) => {
    maskMoney(e);
  }, []);

  const columns = [
    {
      key: "name",
      label: "Nome",
    },
    {
      key: "bar_code",
      label: "Codigo de barras",
    },
    {
      key: "price",
      label: "Preço unitário",
    },
    {
      key: "quanity",
      label: "Quantidade",
    },
    {
      key: "total",
      label: "Total",
    },
    {
      key: "delete",
      label: "",
    },
  ];

  const data = products.map((item) => {
    return {
      name: item.products.name,
      bar_code: item.products.bar_code,
      price:
        "R$ " +
        parseFloat(item.products.price.toString()).toFixed(2).replace(".", ","),
      quanity: (
        <div className="w-20 mx-auto">
          <Input
            type="text"
            value={item.quantity}
            style={{
              textAlign: "center",
            }}
            onChange={(e) => {
              handleMaskOnlyNumbers(e);

              let changeProduct = [...products];

              changeProduct.map((product) => {
                if (product.products.id === item.products.id) {
                  product.quantity = e.target.value
                    ? parseInt(e.target.value)
                    : 0;
                  product.total = product.products.price * product.quantity;
                }
              });

              setProducts(changeProduct);
            }}
          />
        </div>
      ),
      total:
        "R$ " + parseFloat(item.total.toString()).toFixed(2).replace(".", ","),
      delete: (
        <div className="flex justify-center">
          <button
            type="button"
            className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-4 py-2 text-sm font-medium cursor-pointer"
            onClick={() => {
              const newProducts = products.filter(
                (product) => product.products.id !== item.products.id
              );
              setProducts(newProducts);
            }}
          >
            <FaTrashCan size={24} />
          </button>
        </div>
      ),
    };
  });

  return is_opened ? (
    <Wrapper title="Caixa" pathname={APP_ROUTER.private.caixa.name}>
      <CardGlass
        style={{
          minHeight: "calc(100vh - 60px)",
        }}
      >
        <div
          className={`flex flex-col ${
            products.length > 0 && "justify-between"
          } gap-6 py-6`}
          style={{
            minHeight: "calc(100vh - 100px)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">Caixa</h2>
              <span className="text-lg text-light-400">
                Faça aqui suas vendas.
              </span>
            </div>
            <Step step={currentStep} />
            <Button color="primary" onClick={() => setToggle(true)}>
              Operações
            </Button>
          </div>
          <div className="flex justify-between items-center">
            {currentStep === 1 && (
              <form className="flex items-center gap-4" onSubmit={handleSubmit}>
                <Input
                  label="código de barras"
                  type="text"
                  name="bar_code"
                  placeholder="Ex: 7894900011517"
                  onChange={(e) => {
                    handleMaskOnlyNumbers(e);

                    if (e.target.value.length === 13) {
                      handleAddProduct(e.target.value);
                    }
                  }}
                />
                <button
                  type="submit"
                  className={`min-w-20 flex justify-center mt-6 text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-4 py-2 text-sm font-medium cursor-pointer ${
                    loading
                      ? "opacity-50 cursor-not-allowed flex justify-center items-center min-w-24"
                      : ""
                  }`}
                >
                  <IoAdd size={24} />
                </button>
              </form>
            )}
            <div
              className={`${
                currentStep == 2 ? "w-full flex justify-end" : "w-1/3"
              }`}
            >
              <div className={`${currentStep == 1 ? "w-full" : "w-1/3"}`}>
                <Display value={"R$ " + totalPrice} />
              </div>
            </div>
          </div>
          {products.length > 0 ? (
            <>
              {currentStep === 1 && <Table columns={columns} data={data} />}
              {currentStep === 2 && (
                <div className="w-full flex flex-col gap-6 justify-center items-center">
                  <h3 className="text-xl font-bold">
                    Selecione a forma de pagamento
                  </h3>
                  <div className="w-full flex justify-center gap-6">
                    <button
                      onClick={() => setPaymentMethod("money")}
                      className={`${
                        paymentMethod === "money"
                          ? "bg-secondary-500"
                          : "bg-primary-500"
                      } w-48 h-24 flex items-center gap-4 p-4 rounded-lg shadow-lg`}
                    >
                      <FaMoneyBill size={24} />
                      Dinheiro
                    </button>
                    <button
                      onClick={() => {
                        setPaymentMethod("credit");
                        setValueReceived("0,00");
                      }}
                      className={`${
                        paymentMethod === "credit"
                          ? "bg-secondary-500"
                          : "bg-primary-500"
                      } w-48 h-24 flex items-center gap-3 p-4 rounded-lg shadow-lg`}
                    >
                      <FaCreditCard size={24} />
                      Cartão de crédito
                    </button>
                    <button
                      onClick={() => {
                        setPaymentMethod("debit");
                        setValueReceived("0,00");
                      }}
                      className={`${
                        paymentMethod === "debit"
                          ? "bg-secondary-500"
                          : "bg-primary-500"
                      } w-48 h-24 flex items-center gap-4 p-4 rounded-lg shadow-lg`}
                    >
                      <FaMoneyCheck size={24} />
                      Cartão de débito
                    </button>
                    <button
                      onClick={() => {
                        setPaymentMethod("pix");
                        setValueReceived("0,00");
                      }}
                      className={`${
                        paymentMethod === "pix"
                          ? "bg-secondary-500"
                          : "bg-primary-500"
                      } w-48 h-24 flex items-center gap-4 p-4 rounded-lg shadow-lg`}
                    >
                      <FaPix size={24} />
                      Pix
                    </button>
                  </div>
                  {paymentMethod === "money" && (
                    <div className="w-full flex justify-between items-center gap-4">
                      <Input
                        label="Valor recebido"
                        type="text"
                        name="value_received"
                        placeholder="Ex: 100,00"
                        onChange={(e) => {
                          handleMaskMoney(e);
                          handleMoneyChange(e);
                        }}
                      />
                      <div className="w-1/3">
                        <Display value={"R$ " + valueReceived} />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  color="secondary"
                  onClick={() => {
                    if (currentStep === 1) {
                      setCurrentStep(2);
                    } else {
                      handleFinishSale();
                    }
                  }}
                >
                  {currentStep === 1 ? "Proximo" : "Finalizar"}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center">
              <span className="text-xl text-light-400">
                Nenhum produto adicionado
              </span>
            </div>
          )}
        </div>
      </CardGlass>
      <Modal open={toggle} close={handleToggle} size={"w-1/2"}>
        <h2 className="text-2xl font-bold text-light-100">
          Operaçoes do caixa
        </h2>
        <span className="text-md text-light-400">
          Selecione uma das opções abaixo
        </span>
        <form
          className="mt-6 grid grid-cols-2 gap-4 text-light-100"
          onSubmit={handleSubmitChange}
        >
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1 ml-4">
              Tipo de operação
            </label>
            <Select
              value={typeOperation}
              onChange={(e) => setTypeOperation(e.target.value)}
              options={[
                {
                  value: "reinforcement",
                  label: "Reforço",
                },
                {
                  value: "sangria",
                  label: "Sangria",
                },
              ]}
            ></Select>
          </div>
          <div className="col-span-2">
            <Input
              name="valueChanged"
              label="Valor"
              placeholder="Ex: 50,00"
              onChange={(e) => handleMaskMoney(e)}
            ></Input>
          </div>
          <div className="col-span-2 flex justify-end gap-4">
            <Button color="primary" onClick={handleToggle}>
              Voltar
            </Button>
            <Button color="secondary" type="submit" loading={loadingBtn}>
              Enviar
            </Button>
          </div>
        </form>
      </Modal>
    </Wrapper>
  ) : null;
}
