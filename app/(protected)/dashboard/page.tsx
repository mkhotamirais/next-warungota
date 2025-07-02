"use client";

import ProtectedRouteRoles from "@/layouts/ProtectedRouteRoles";
import { useFirebaseStore } from "@/lib/firebaseStore";

export default function Dashboard() {
  const { user } = useFirebaseStore();

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
