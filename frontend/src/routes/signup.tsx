import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { SignupForm, type SignupFormData } from "@/components/signup-form";
import useAuth, { isLoggedIn } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  component: Signup,
  beforeLoad: () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" });
    }
  },
});

function Signup() {
  const { signupMutation, resetError } = useAuth();
  const form = useForm<SignupFormData>({
    defaultValues: {
      username: "",
      password: "",
      name: "",
      surname: "",
      birthdate: "",
      email: "",
    },
  });

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    resetError();
    try {
      await signupMutation.mutateAsync(data);
    } catch {
      // handled
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        <SignupForm form={form} onFormSubmit={onSubmit} />
        <p className="text-center text-sm">
          Already have an account? <Link to="/login" className="underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
