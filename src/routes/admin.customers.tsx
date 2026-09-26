import { useEffect } from "react";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";

export default function AdminCustomersPage() {
  useEffect(() => {
    document.title = "Customers | Admin | Ram Adventure";
  }, []);

  return (
    <AdminResourcePage
      resource="customers"
      title="Customers"
      description="View registered accounts, booking history and total customer spend."
    />
  );
}
