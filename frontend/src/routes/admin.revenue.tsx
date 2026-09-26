import { useEffect } from "react";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";

export default function AdminRevenuePage() {
  useEffect(() => {
    document.title = "Revenue | Admin | Ram Adventure";
  }, []);

  return (
    <AdminResourcePage
      resource="revenue"
      title="Revenue"
      description="Track total revenue collected, daily breakdown and weekly financial performance."
    />
  );
}
