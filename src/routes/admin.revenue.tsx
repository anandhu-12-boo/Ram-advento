import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
export const Route = createFileRoute("/admin/revenue")({
  component: () => (
    <AdminResourcePage
      resource="revenue"
      title="Revenue"
      description="See persisted revenue totals for today, this week, this month, and the lifetime booking record."
    />
  ),
});
