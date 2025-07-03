import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { BodyAuthLogin } from "@/client";
import { LoginForm } from "@/components/login-form";
import useAuth, { isLoggedIn } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" });
    }
  },
});

function Login() {
  const { loginMutation, resetError } = useAuth();

  const form = useForm<BodyAuthLogin>({
    defaultValues: { username: "", password: "" },
    mode: "onSubmit",
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<BodyAuthLogin> = async (data: BodyAuthLogin) => {
    resetError();
    try {
      await loginMutation.mutateAsync(data);
    } catch {
      // error is handled by useAuth hook
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        <LoginForm form={form} onFormSubmit={onSubmit} />
        <p className="text-center text-sm">
          Don't have an account? <Link to="/signup" className="underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
