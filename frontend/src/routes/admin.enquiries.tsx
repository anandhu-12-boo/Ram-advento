import { useEffect } from "react";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";

export default function AdminEnquiriesPage() {
  useEffect(() => {
    document.title = "Enquiries | Admin | Ram Adventure";
  }, []);

  return (
    <AdminResourcePage
      resource="enquiries"
      title="Enquiries"
      description="Respond to contact requests, custom safari inquiries and messages."
    />
  );
}
