import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UserMenu({ onLogout }: { onLogout: () => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon">
          <UserIcon className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          className={cn(
            "z-50 min-w-32 rounded-md border bg-white p-1 text-sm shadow-md dark:bg-slate-950"
          )}
        >
          <DropdownMenu.Item asChild>
            <Link
              to="/history"
              className="block cursor-pointer select-none rounded-sm px-2 py-1 focus:bg-slate-100 dark:focus:bg-slate-800"
            >
              History
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              to="/settings"
              className="block cursor-pointer select-none rounded-sm px-2 py-1 focus:bg-slate-100 dark:focus:bg-slate-800"
            >
              Settings
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
          <DropdownMenu.Item
            onSelect={onLogout}
            className="cursor-pointer select-none rounded-sm px-2 py-1 focus:bg-slate-100 dark:focus:bg-slate-800"
          >
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
