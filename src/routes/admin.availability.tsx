import { useEffect } from "react";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";

export default function AdminAvailabilityPage() {
  useEffect(() => {
    document.title = "Availability | Admin | Ram Adventure";
  }, []);

  return (
    <AdminResourcePage
      resource="availability"
      title="Availability"
      description="Manage daily slot availability across your jeep safari routes."
    />
  );
}
