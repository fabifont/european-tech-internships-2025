import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Route } from "@/routes/jobs";
import * as React from "react";

interface DataTablePaginationProps {
  pageSize: number;
  hasMore: boolean;
}

export function DataTablePagination({
  pageSize,
  hasMore,
}: DataTablePaginationProps) {
  const { page, limit, q } = Route.useSearch();
  const navigate = Route.useNavigate();

  // Helper to update both page and limit in the URL
  const updateSearch = (newPage: number, newLimit: number) =>
    navigate({
      to: ".",
      search: { page: newPage, limit: newLimit, q },
      replace: true,
    });

  // Local state for the editable page input
  const [pageInput, setPageInput] = React.useState<string>(String(page));

  // Keep pageInput in sync when external page changes
  React.useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const commitPageChange = () => {
    const parsed = Number(pageInput);
    if (Number.isNaN(parsed) || parsed < 1) {
      setPageInput(String(page));
      return;
    }
    updateSearch(parsed, limit);
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
      {/* Rows‐per‐page dropdown */}
      <div className="flex items-center space-x-2">
        <span className="text-sm">Rows per page:</span>
        <Select
          defaultValue={`${pageSize}`}
          onValueChange={(val) => {
            const size = Number(val);
            updateSearch(1, size);
          }}
        >
          <SelectTrigger className="h-8 w-[80px]">
            <SelectValue placeholder={`${pageSize}`} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 50, 100].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page !== 1) updateSearch(1, limit);
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            >
              First
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) updateSearch(page - 1, limit);
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <Input
              type="number"
              min={1}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={commitPageChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className="h-9 w-12 text-center"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasMore) updateSearch(page + 1, limit);
              }}
              className={!hasMore ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
