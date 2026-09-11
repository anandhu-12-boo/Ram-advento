import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
export const Route = createFileRoute("/admin/reviews")({
  component: () => (
    <AdminResourcePage
      resource="reviews"
      title="Reviews"
      description="Moderate customer reviews from the secured review store before they appear publicly."
    />
  ),
});
