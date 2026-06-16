"use client";

import { Suspense } from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/cuenta";
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      setServerError(
        error.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos"
          : error.message
      );
      return;
    }
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="size-14 rounded-2xl bg-pool-600 flex items-center justify-center mx-auto mb-4">
            <svg className="size-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 18c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1v2c-1.5 0-2.5-1-4-1s-2.5 1-4 1-2.5-1-4-1-2.5 1-4 1v-2zm0-4c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1v2c-1.5 0-2.5-1-4-1s-2.5 1-4 1-2.5-1-4-1-2.5 1-4 1v-2zm8-10a4 4 0 110 8 4 4 0 010-8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Bienvenido de vuelta</h1>
          <p className="text-sm text-slate-500 mt-1">Ingresa a tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              error={errors.email?.message}
              required
              {...register("email")}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
              {...register("password")}
            />

            {serverError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              size="lg"
            >
              Iniciar sesión
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            ¿No tienes cuenta?{" "}
            <Link
              href="/auth/registro"
              className="text-pool-600 hover:underline font-medium"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#eef9ff] p-8">
          <div className="mx-auto max-w-md rounded-[1.35rem] bg-white p-8 text-center font-black text-slate-700 shadow-xl shadow-cyan-950/5">
            Cargando acceso...
          </div>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
