import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type SignupFormData = {
  username: string;
  password: string;
  name?: string;
  surname?: string;
  birthdate?: string;
  email?: string;
};

export type SignupFormProps = React.ComponentPropsWithoutRef<"div"> & {
  form: UseFormReturn<SignupFormData>;
  onFormSubmit: SubmitHandler<SignupFormData>;
};

export function SignupForm({
  className,
  form,
  onFormSubmit,
  ...props
}: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" {...register("name")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="surname">Surname</Label>
              <Input id="surname" type="text" {...register("surname")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input id="birthdate" type="date" {...register("birthdate")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
