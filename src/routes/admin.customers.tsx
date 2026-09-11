import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
export const Route = createFileRoute("/admin/customers")({
  component: () => (
    <AdminResourcePage
      resource="customers"
      title="Customers"
      description="Review customer accounts and their persisted booking history without exposing passwords."
    />
  ),
});
