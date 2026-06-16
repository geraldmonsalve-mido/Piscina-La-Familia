"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const schema = z
  .object({
    full_name: z.string().min(3, "Ingresa tu nombre completo"),
    email: z.string().email("Correo inválido"),
    phone: z
      .string()
      .min(10, "Teléfono inválido")
      .regex(/^[0-9+\-\s]+$/, "Solo números y +/-"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

export default function RegistroPage() {
  const router = useRouter();
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name, phone: data.phone },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      setServerError(
        error.message.includes("already registered")
          ? "Este correo ya está registrado"
          : error.message
      );
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20">
        <div className="w-full max-w-sm text-center">
          <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="size-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Revisa tu correo
          </h2>
          <p className="text-slate-600 mb-6">
            Te enviamos un enlace de confirmación a tu correo electrónico. Haz
            clic en él para activar tu cuenta.
          </p>
          <Link href="/auth/login">
            <Button fullWidth>Ir a iniciar sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="size-14 rounded-2xl bg-pool-600 flex items-center justify-center mx-auto mb-4">
            <svg className="size-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 18c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1v2c-1.5 0-2.5-1-4-1s-2.5 1-4 1-2.5-1-4-1-2.5 1-4 1v-2zm0-4c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1v2c-1.5 0-2.5-1-4-1s-2.5 1-4 1-2.5-1-4-1-2.5 1-4 1v-2zm8-10a4 4 0 110 8 4 4 0 010-8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Crea tu cuenta</h1>
          <p className="text-sm text-slate-500 mt-1">Es gratis y toma 1 minuto</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Juan Pérez"
              error={errors.full_name?.message}
              required
              {...register("full_name")}
            />

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              error={errors.email?.message}
              required
              {...register("email")}
            />

            <Input
              label="Teléfono"
              type="tel"
              placeholder="0412-000-0000"
              error={errors.phone?.message}
              required
              {...register("phone")}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="Mínimo 6 caracteres"
              error={errors.password?.message}
              required
              {...register("password")}
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="Repite tu contraseña"
              error={errors.confirm_password?.message}
              required
              {...register("confirm_password")}
            />

            {serverError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <Button type="submit" fullWidth loading={isSubmitting} size="lg">
              Crear cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/auth/login"
              className="text-pool-600 hover:underline font-medium"
            >
              Inicia sesión
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
