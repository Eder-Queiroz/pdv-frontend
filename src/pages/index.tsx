import { useState, FormEvent } from "react";
import { Roboto } from "next/font/google";
import { Card, Input, Button } from "@/components";
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { signIn } = useAuth();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !password) {
      return toast.warning("Por favor preencha todos os campos");
    }

    signIn({ name, password }).catch((error) => {
      console.log("[ERRO AO LOGAR]" + error);
    });
  };

  return (
    <main
      className={`${roboto.className} w-screen h-screen bg-primary-800 relative`}
    >
      <div className="h-full flex justify-center items-center relative z-10">
        <Card
          style={{
            minWidth: "360px",
          }}
        >
          <h3 className="text-3xl font-bold">Bem vindo de volta!</h3>
          <p className="text-md text-primary-100">
            Faça login para acessar sua conta
          </p>
          <form className="flex flex-col gap-6 mt-6" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Nome"
                type="text"
                placeholder="Ex: admin"
                onChange={(e) => setName(e.target.value)}
                style={{
                  marginBottom: ".5rem",
                }}
              />
              <Input
                label="Senha"
                type="password"
                placeholder="*********"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" color="secondary">
              Entrar
            </Button>
          </form>
        </Card>
      </div>
      <div className="absolute bottom-0">
        <img src="vector.svg" alt="vetor" />
      </div>
    </main>
  );
}
