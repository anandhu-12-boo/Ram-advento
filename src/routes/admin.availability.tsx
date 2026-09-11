import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
export const Route = createFileRoute("/admin/availability")({
  component: () => (
    <AdminResourcePage
      resource="availability"
      title="Availability"
      description="Monitor slot capacity and prevent overbooking across the connected booking inventory."
    />
  ),
});
