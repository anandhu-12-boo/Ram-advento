import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
export const Route = createFileRoute("/admin/enquiries")({
  component: () => (
    <AdminResourcePage
      resource="enquiries"
      title="Enquiries"
      description="Track contact enquiries and their persisted resolution status."
    />
  ),
});
