import { useEffect, useState, useCallback, FormEvent } from "react";
import useAuth from "@/hooks/useAuth";
import {
  Wrapper,
  CardGlass,
  Button,
  Table,
  Pagination,
  Input,
  Select,
  Modal,
} from "@/components";
import { APP_ROUTER } from "@/utils/constants/app-router";
import { getShits, openShift, closeShift } from "@/service/apiClient";
import ShiftType from "@/utils/types/shift";
import { maskMoney } from "@/functions/masks";
import Router from "next/router";

interface shiftSearchProps {
  start_time?: string;
  end_time?: string;
  is_opened?: string;
  limit: number;
  offset: number;
}

export default function Dashboard() {
  const [shifts, setShifts] = useState<ShiftType[]>([]);
  const [totalShifts, setTotalShifts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [start_time, setStartTime] = useState<string>("");
  const [end_time, setEndTime] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [limit, setLimit] = useState<number>(6);
  const [offset, setOffset] = useState<number>(0);
  const [toggle, setToggle] = useState<boolean>(false);
  const [isOpenShift, setIsOpenShift] = useState<boolean>(false);
  const [cash, setCash] = useState<number>(0);

  const {
    userData: { is_opened },
  } = useAuth();

  const handleToggle = () => setToggle(!toggle);

  const handleKeyUp = useCallback((e: FormEvent<HTMLInputElement>) => {
    maskMoney(e);
  }, []);

  const handleCloseShift = async () => {
    try {
      await closeShift({ end_cash: cash });
    } catch (error) {
      console.error("[Erro ao fechar turno]", error);
    } finally {
      setCash(0);
      Router.reload();
    }
  };

  const handleOpenShift = async () => {
    try {
      await openShift({ start_cash: cash });
    } catch (error) {
      console.error("[Erro ao abrir turno]", error);
    } finally {
      setCash(0);
      Router.reload();
    }
  };

  const handleGetShits = async ({
    start_time,
    end_time,
    is_opened,
    limit,
    offset,
  }: shiftSearchProps) => {
    setLoading(true);
    try {
      const { count, rows } = await getShits({
        start_time,
        end_time,
        is_opened,
        limit,
        offset,
      });
      setShifts(rows);
      setTotalShifts(count);
    } catch (error) {
      console.error("[Erro ao buscar turnos]", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetShits({
      start_time,
      end_time,
      is_opened: status,
      limit,
      offset,
    });
  }, []);

  const handleSetPage = (offset: number, limit: number) => {
    setOffset(offset);
    setLimit(limit);
    handleGetShits({ limit, offset });
  };

  const columns = [
    {
      key: "name",
      label: "Nome",
    },
    {
      key: "start",
      label: "Início",
    },
    {
      key: "end",
      label: "Fim",
    },
    {
      key: "balance",
      label: "Saldo",
    },
    {
      key: "reinforcement",
      label: "Reforço",
    },
    {
      key: "sangria",
      label: "Sangria",
    },
    {
      key: "status",
      label: "Status",
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
          start: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          end: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          balance: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          reinforcement: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          sangria: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
          status: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
        },
      ]
    : shifts.map((shift) => ({
        name: shift.user.name,
        start: new Date(shift.start_time).toLocaleString("pt-BR", {
          timeZone: "UTC",
        }),
        end: new Date(shift.end_time).toLocaleString("pt-BR", {
          timeZone: "UTC",
        }),
        balance: shift.is_opened
          ? "R$ 0,00"
          : "R$ " + (shift.end_cash - shift.start_cash).toFixed(2),
        reinforcement:
          "R$ " +
          parseFloat(shift.changeds.reinforcement.toString()).toFixed(2),
        sangria:
          "R$ " + parseFloat(shift.changeds.sangria.toString()).toFixed(2),
        status: shift.is_opened ? "Aberto" : "Fechado",
      }));

  return (
    <Wrapper title="Turno" pathname={APP_ROUTER.private.turno.name}>
      <CardGlass
        style={{
          minHeight: "calc(100vh - 60px)",
        }}
      >
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">Turnos</h2>
              <span className="text-lg text-light-400">
                Gerencie seus turnos.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Input
                label="Data de início"
                type="date"
                style={{
                  marginBottom: "1.5rem",
                }}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  handleGetShits({
                    start_time: e.target.value,
                    end_time,
                    is_opened: status,
                    limit,
                    offset,
                  });
                }}
              />
              <Input
                label="Data de fim"
                type="date"
                style={{
                  marginBottom: "1.5rem",
                }}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  handleGetShits({
                    start_time,
                    end_time: e.target.value,
                    is_opened: status,
                    limit,
                    offset,
                  });
                }}
              />
              <Select
                label="Status"
                onChange={(e) => {
                  setStatus(e.target.value);
                  handleGetShits({
                    start_time,
                    end_time,
                    is_opened: e.target.value,
                    limit,
                    offset,
                  });
                }}
                defaultValue={""}
                options={[
                  {
                    value: "",
                    label: "Todos",
                  },
                  {
                    value: "true",
                    label: "Aberto",
                  },
                  {
                    value: "false",
                    label: "Fechado",
                  },
                ]}
                style={{
                  marginBottom: "1.5rem",
                }}
              />
              <div>
                {!is_opened ? (
                  <Button
                    color="secondary"
                    onClick={() => {
                      setIsOpenShift(true);
                      handleToggle();
                    }}
                  >
                    Abrir turno
                  </Button>
                ) : (
                  <Button
                    color="danger"
                    onClick={() => {
                      setIsOpenShift(false);
                      handleToggle();
                    }}
                    style={{
                      backgroundColor: "#ff0505",
                    }}
                  >
                    Fechar turno
                  </Button>
                )}
              </div>
            </div>
          </div>
          <Table columns={columns} data={data} />
          <Pagination
            limit={limit}
            page={offset}
            total={totalShifts}
            setPage={handleSetPage}
          />
        </div>
      </CardGlass>

      <Modal open={toggle} close={handleToggle} size={"w-1/2"}>
        <h2 className="text-2xl font-bold text-light-100">
          {isOpenShift ? "Abertura do caixa" : "Fechamento do caixa"}
        </h2>
        <span className="text-md text-light-400">
          {isOpenShift
            ? "Informe o valor inicial do caixa."
            : "Informe o valor final do caixa."}
        </span>
        <Input
          type="string"
          placeholder="Ex: 200,00"
          style={{
            marginTop: "1.5rem",
          }}
          onChange={(e) => {
            handleKeyUp(e);
            let value = e.target.value.replace(",", ".");
            setCash(parseFloat(value));
          }}
        />
        <div className="flex justify-end gap-4 mt-6">
          <Button color="primary" onClick={() => handleToggle()}>
            Cancelar
          </Button>
          <Button
            color={isOpenShift ? "secondary" : "danger"}
            loading={loadingBtn}
            onClick={() => {
              isOpenShift ? handleOpenShift() : handleCloseShift();
            }}
            style={{
              backgroundColor: !isOpenShift ? "#ff0505" : "",
            }}
          >
            {isOpenShift ? "Abrir turno" : "Fechar turno"}
          </Button>
        </div>
      </Modal>
    </Wrapper>
  );
}
