import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import useAuth, { isLoggedIn } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/password-input";

export const Route = createFileRoute("/settings")({
  component: Settings,
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" });
    }
  },
});

function Settings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const profileForm = useForm({
    defaultValues: {
      name: user?.name ?? "",
      surname: user?.surname ?? "",
      birthdate: user?.birthdate ?? "",
      email: user?.email ?? "",
    },
  });

  const passwordForm = useForm({ defaultValues: { old_password: "", new_password: "" } });

  const onUpdateProfile: SubmitHandler<typeof profileForm.getValues()> = async (data) => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(data),
    });
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };

  const onChangePassword: SubmitHandler<typeof passwordForm.getValues()> = async (data) => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(data),
    });
    passwordForm.reset();
  };

  return (
    <div className="mx-auto max-w-xl space-y-8 p-6">
      <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...profileForm.register("name")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="surname">Surname</Label>
          <Input id="surname" {...profileForm.register("surname")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="birthdate">Birthdate</Label>
          <Input id="birthdate" type="date" {...profileForm.register("birthdate")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...profileForm.register("email")} />
        </div>
        <Button type="submit">Save</Button>
      </form>
      <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="old_password">Old Password</Label>
          <PasswordInput id="old_password" {...passwordForm.register("old_password", { required: true })} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new_password">New Password</Label>
          <PasswordInput id="new_password" {...passwordForm.register("new_password", { required: true })} />
        </div>
        <Button type="submit">Change Password</Button>
      </form>
    </div>
  );
}
