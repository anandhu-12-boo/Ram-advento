import { useEffect } from "react";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";

export default function AdminToursPage() {
  useEffect(() => {
    document.title = "Tours | Admin | Ram Adventure";
  }, []);

  return (
    <AdminResourcePage
      resource="tours"
      title="Tours"
      description="Review the tours currently exposed to the public booking experience."
    />
  );
}
