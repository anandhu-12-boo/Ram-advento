import { useEffect } from "react";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";

export default function AdminReviewsPage() {
  useEffect(() => {
    document.title = "Reviews | Admin | Ram Adventure";
  }, []);

  return (
    <AdminResourcePage
      resource="reviews"
      title="Reviews"
      description="Moderate customer feedback, approve testimonials and review ratings."
    />
  );
}
