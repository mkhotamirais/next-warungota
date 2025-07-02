"use client";

import { useFirebaseStore } from "@/lib/firebaseStore";

export default function Dashboard() {
  const { user } = useFirebaseStore();
  return (
    <section className="section">
      <div className="container">
        <h1 className="h1">Dashboard</h1>
        <p>Hi, {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>
    </section>
  );
}
