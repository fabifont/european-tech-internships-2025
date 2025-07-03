import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { BodyAuthLogin, UserRead } from "@/client/types.gen";
import { useToast } from "@/hooks/use-toast";

const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null;
};

const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: user, isLoading } = useQuery<UserRead | null, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return (await res.json()) as UserRead;
    },
    enabled: isLoggedIn(),
  });

  type SignupData = {
    username: string;
    password: string;
    name?: string;
    surname?: string;
    birthdate?: string;
    email?: string;
  };

  const signup = async (data: SignupData) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    await login({ username: data.username, password: data.password });
  };

  const login = async (data: BodyAuthLogin) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const json = (await res.json()) as { access_token: string };
    localStorage.setItem("access_token", json.access_token);
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast({
        description: "Login successful",
        variant: "success",
      });
      navigate({ to: "/" });
    },
    onError: async (err: Object) => {
      const error = (err as any)?.detail ?? "Something went wrong";
      toast({
        description: error,
        variant: "destructive",
      });
      setError(error);
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast({ description: "Signup successful", variant: "success" });
      navigate({ to: "/" });
    },
    onError: async (err: Object) => {
      const error = (err as any)?.detail ?? "Something went wrong";
      toast({ description: error, variant: "destructive" });
      setError(error);
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    toast({
      description: "Logout successful",
      variant: "success",
    });
    navigate({ to: "/login" });
  };

  return {
    loginMutation,
    signupMutation,
    logout,
    user,
    isLoading,
    error,
    resetError: () => setError(null),
  };
};

export { isLoggedIn };
export default useAuth;
