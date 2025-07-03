"use client";

import ProtectedRouteRoles from "@/layouts/ProtectedRouteRoles";
import { useUserStore } from "@/lib/hooks/useUserStore";

export default function Dashboard() {
  const { user } = useUserStore();

  return (
    <ProtectedRouteRoles authorizedRoles={["admin", "superadmin", "editor", "user"]}>
      <section className="section">
        <div className="container">
          <h1 className="h1">Dashboard</h1>
          <p>Hi, {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>
      </section>
    </ProtectedRouteRoles>
  );
}
