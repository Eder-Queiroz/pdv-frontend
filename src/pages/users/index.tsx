import { useState, useEffect, FormEvent, FormHTMLAttributes } from "react";
import useAuth from "@/hooks/useAuth";
import {
  Wrapper,
  CardGlass,
  Input,
  Table,
  Pagination,
  Button,
  Select,
  Modal,
} from "@/components";
import { APP_ROUTER } from "@/utils/constants/app-router";
import UserType from "@/utils/types/user";
import Router from "next/router";
import { toast } from "react-toastify";
import { getUsers, singIn } from "@/service/apiClient";

export default function Users() {
  const {
    userData: { role },
  } = useAuth();

  if (role !== "manager") {
    toast.error("Não tem permissão para acessar essa página!");
    Router.push(APP_ROUTER.private.turno.name);
  }

  const [users, setUsers] = useState<UserType[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [roleUser, setRoleUser] = useState<string>("");

  const handleToggleModal = () => setToggleModal(!toggleModal);

  const handleGetUsers = async ({ limit, offset }: any) => {
    setLoading(true);
    try {
      const { count, rows } = await getUsers({ limit, offset });
      setUsers(rows);
      setTotalUsers(count);
    } catch (error) {
      console.error("[ERROR GET USERS]", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(users);

  useEffect(() => {
    handleGetUsers({ limit, offset });
  }, []);

  const handleSetPage = (offset: number, limit: number) => {
    setOffset(offset);
    setLimit(limit);
    handleGetUsers({ limit, offset });
  };

  const handleSignIn = async (name: string, password: string, role: string) => {
    setLoadingBtn(true);
    let status: any;
    try {
      status = await singIn({ name, password, role });
    } catch (error) {
      console.error("[ERROR SIGN IN]", error);
    } finally {
      setLoadingBtn(false);
      if (status === 201) {
        toast.success("Usuário criado com sucesso!");
      } else {
        toast.error("Erro ao criar usuário!");
      }
      handleToggleModal();
      handleGetUsers({ limit, offset });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = e.currentTarget.nome.value;
    const password = e.currentTarget.password.value;
    handleSignIn(name, password, roleUser);
  };

  const columns = [
    {
      key: "name",
      label: "Nome",
    },
    {
      key: "role",
      label: "Função",
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
          role: (
            <div className="w-[200px] animate-pulse flex m-auto p-4">
              <div className="w-full h-4 my-bg-gray-300 rounded-lg"></div>
            </div>
          ),
        },
      ]
    : users.map((user) => ({
        name: user.name,
        role: user.role,
      }));

  return role === "manager" ? (
    <Wrapper title="Usuários" pathname={APP_ROUTER.private.users.name}>
      <CardGlass
        style={{
          minHeight: "calc(100vh - 60px)",
        }}
      >
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">Usuários</h2>
              <span className="text-lg text-light-400">
                Gerencie os usuários da plataforma.
              </span>
            </div>
            <Button color="secondary" onClick={handleToggleModal}>
              Criar usuario
            </Button>
          </div>
          <Table columns={columns} data={data} />
          <Pagination
            limit={limit}
            page={offset}
            total={totalUsers}
            setPage={handleSetPage}
          />
        </div>
      </CardGlass>
      <Modal open={toggleModal} close={handleToggleModal} size={"w-1/2"}>
        <h2 className="text-2xl font-bold text-light-100">Novo usuário</h2>
        <span className="text-md text-light-400">
          Crie um novo usuário para acessar a plataforma.
        </span>
        <form
          className="mt-6 grid grid-cols-2 gap-4 text-light-100"
          onSubmit={handleSubmit}
        >
          <div className="col-span-1">
            <Input label="Nome" placeholder="Nome" name="nome" type="text" />
          </div>
          <div className="col-span-1">
            <Input
              label="Senha"
              placeholder="Senha"
              type="password"
              name="password"
            />
          </div>
          <div className="col-span-2">
            <Select
              name="role"
              label="Função"
              options={[
                { label: "Gerente", value: "manager" },
                { label: "Funcionario", value: "employee" },
              ]}
              onChange={(e) => setRoleUser(e.currentTarget.value)}
            />
          </div>
          <div className="col-span-2 flex justify-end gap-4">
            <Button color="primary" onClick={handleToggleModal}>
              voltar
            </Button>
            <Button color="secondary" type="submit" loading={loadingBtn}>
              Criar
            </Button>
          </div>
        </form>
      </Modal>
    </Wrapper>
  ) : null;
}
