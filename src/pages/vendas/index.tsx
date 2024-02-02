import { useEffect, useState } from "react";
import {
  Wrapper,
  CardGlass,
  Table,
  Pagination,
  Input,
  Select,
  Modal,
} from "@/components";
import { APP_ROUTER } from "@/utils/constants/app-router";
import SaleType from "@/utils/types/sale";
import { getSales } from "@/service/apiClient";

interface SaleSearchProps {
  payment_method?: string;
  start_sale_time?: string;
  end_sale_time?: string;
  limit: number;
  offset: number;
}

export default function Sale() {
  const [sales, setSales] = useState<SaleType[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [payment_method, setPayment_method] = useState<string>("");
  const [start_sale_time, setStart_sale_time] = useState<string>("");
  const [end_sale_time, setEnd_sale_time] = useState<string>("");
  const [limit, setLimit] = useState<number>(6);
  const [offset, setOffset] = useState<number>(0);

  const handleGetSales = async ({
    payment_method,
    start_sale_time,
    end_sale_time,
    limit,
    offset,
  }: SaleSearchProps) => {
    setLoading(true);

    try {
      const { count, rows } = await getSales({
        payment_method,
        start_sale_time,
        end_sale_time,
        limit,
        offset,
      });
      setSales(rows);
      setTotalSales(count);
    } catch (error) {
      console.error("Erro ao buscar vendas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetSales({
      payment_method,
      start_sale_time,
      end_sale_time,
      limit,
      offset,
    });
  }, []);

  const handleSetPage = (offset: number, limit: number) => {
    setOffset(offset);
    setLimit(limit);
    handleGetSales({ limit, offset });
  };

  const columns = [
    {
      key: "product",
      label: "Produto",
    },
    {
      key: "price",
      label: "Preço",
    },
    {
      key: "quantity",
      label: "Unidades vendidas",
    },
    {
      key: "total",
      label: "Total",
    },
    {
      key: "payment_method",
      label: "Metodo de pagamento",
    },
    {
      key: "date",
      label: "Data",
    },
  ];

  const data = loading
    ? [
        {
          product: (
            <div className="w-[160px] animate-pulse flex m-auto p-2">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          price: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          quantity: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          total: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          payment_method: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          date: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
        },
      ]
    : sales.map((sale) => ({
        product: sale.product.name,
        price: "R$ " + sale.product.price,
        quantity: sale.quantity,
        total: "R$ " + sale.product.price * sale.quantity,
        payment_method: sale.payment_method,
        date: new Date(sale.sale_time).toLocaleString("pt-BR", {
          timeZone: "UTC",
        }),
      }));

  return (
    <Wrapper title="Vendas" pathname={APP_ROUTER.private.vendas.name}>
      <CardGlass
        style={{
          minHeight: "calc(100vh - 60px)",
        }}
      >
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">Vendas</h2>
              <span className="text-lg text-light-400">
                Gerencie suas vendas.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Input
                label="Data de início"
                type="date"
                onChange={(e) => {
                  setStart_sale_time(e.target.value);
                  handleGetSales({
                    payment_method,
                    start_sale_time: e.target.value,
                    end_sale_time,
                    limit,
                    offset,
                  });
                }}
                style={{
                  marginBottom: "1.5rem",
                }}
              />
              <Input
                label="Data de fim"
                type="date"
                onChange={(e) => {
                  setEnd_sale_time(e.target.value);
                  handleGetSales({
                    payment_method,
                    start_sale_time,
                    end_sale_time: e.target.value,
                    limit,
                    offset,
                  });
                }}
                style={{
                  marginBottom: "1.5rem",
                }}
              />
              <Select
                label="Pagemento"
                defaultValue={""}
                onChange={(e) => {
                  setPayment_method(e.target.value);
                  handleGetSales({
                    payment_method: e.target.value,
                    start_sale_time,
                    end_sale_time,
                    limit,
                    offset,
                  });
                }}
                options={[
                  {
                    value: "",
                    label: "Todos",
                  },
                  {
                    value: "money",
                    label: "Dinheiro",
                  },
                  {
                    value: "credit",
                    label: "Cartão de crédito",
                  },
                  {
                    value: "debit",
                    label: "Cartão de debito",
                  },
                ]}
                style={{
                  marginBottom: "1.5rem",
                }}
              />
            </div>
          </div>
          <Table columns={columns} data={data} />
          <Pagination
            limit={limit}
            page={offset}
            total={totalSales}
            setPage={handleSetPage}
          />
        </div>
      </CardGlass>
    </Wrapper>
  );
}
