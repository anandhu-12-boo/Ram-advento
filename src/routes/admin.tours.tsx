import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
export const Route = createFileRoute("/admin/tours")({
  component: () => (
    <AdminResourcePage
      resource="tours"
      title="Tours"
      description="Review the tours currently exposed to the public booking experience."
    />
  ),
});
