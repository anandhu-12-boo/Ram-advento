import { Navigate } from "react-router-dom";

export default function AdminLoginPage() {
  return <Navigate to="/login?redirect=/admin" replace />;
}
