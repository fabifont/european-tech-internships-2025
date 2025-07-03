import { createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/history")({
  component: History,
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" });
    }
  },
});

function History() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/search-history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!res.ok) throw new Error();
      return (await res.json()) as Array<{ id: string; query: string; created_at: string }>;
    },
    enabled: !!user,
  });

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Search History</h1>
      <ul className="space-y-2">
        {data?.map((h) => (
          <li key={h.id} className="border-b pb-2 last:border-b-0">
            <span className="font-medium">{h.query}</span>
            <span className="ml-2 text-xs text-slate-500">{new Date(h.created_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
