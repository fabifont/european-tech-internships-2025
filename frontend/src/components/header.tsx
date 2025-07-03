import logo from "@/static/logo.png";
import { Link } from "@tanstack/react-router";
import useAuth from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";

export function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="w-full flex items-center justify-between py-4 border-b bg-white dark:bg-slate-950 px-4">
      <img src={logo} alt="Logo" className="h-10" />
      {user ? (
        <UserMenu onLogout={logout} />
      ) : (
        <Button asChild variant="outline">
          <Link to="/login">Login</Link>
        </Button>
      )}
    </header>
  );
}
