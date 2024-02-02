import { AllHTMLAttributes, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { NavItem, NavLink } from "@/components";
import { APP_ROUTER } from "@/utils/constants/app-router";
import {
  FaClock,
  FaPowerOff,
  FaCashRegister,
  FaMoneyBillTrendUp,
  FaBasketShopping,
  FaLock,
  FaUsers,
} from "react-icons/fa6";

interface SidebarProps extends AllHTMLAttributes<HTMLElement> {
  pathName?: string;
}

export const Sidebar = ({ pathName, ...rest }: SidebarProps) => {
  const {
    signOut,
    userData: { is_opened, role },
  } = useAuth();

  console.log(role);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Volte Sempre!");
  };

  return (
    <aside className={`h-screen sticky top-0 bg-primary-800`}>
      <nav
        className="flex flex-col gap-4 bg-primary-800 px-3 py-6 
          h-full w-[300px] shadow-2xl
        "
      >
        <ul className="mt-4 ">
          <NavItem
            active={pathName === APP_ROUTER.private.caixa.name}
            disabled={!is_opened}
          >
            <NavLink
              href={APP_ROUTER.private.caixa.name}
              style={{
                justifyContent: "space-between",
              }}
              disabled={!is_opened}
            >
              <div className="w-full h-full flex items-center gap-2">
                <FaCashRegister className="mr-2" size={24} />
                <span>Caixa</span>
              </div>
              {!is_opened && <FaLock className="ml-2" size={24} />}
            </NavLink>
          </NavItem>
          <NavItem active={pathName === APP_ROUTER.private.turno.name}>
            <NavLink href={APP_ROUTER.private.turno.name}>
              <FaClock className="mr-2" size={24} />
              <span>Turnos</span>
            </NavLink>
          </NavItem>
          <NavItem active={pathName === APP_ROUTER.private.produtos.name}>
            <NavLink href={APP_ROUTER.private.produtos.name}>
              <FaBasketShopping className="mr-2" size={24} />
              <span>Produtos</span>
            </NavLink>
          </NavItem>
          <NavItem active={pathName === APP_ROUTER.private.vendas.name}>
            <NavLink href={APP_ROUTER.private.vendas.name}>
              <FaMoneyBillTrendUp className="mr-2" size={24} />
              <span>Vendas</span>
            </NavLink>
          </NavItem>
          {role === "manager" && (
            <NavItem active={pathName === APP_ROUTER.private.users.name}>
              <NavLink href={APP_ROUTER.private.users.name}>
                <FaUsers className="mr-2" size={24} />
                <span>Usuários</span>
              </NavLink>
            </NavItem>
          )}
          <NavItem onClick={handleSignOut}>
            <div className="w-full h-full flex items-center p-2 gap-2">
              <FaPowerOff className="mr-2" size={24} />
              <span>Sair</span>
            </div>
          </NavItem>
        </ul>
      </nav>
    </aside>
  );
};
