"use client";

import PendingPage from "@/components/PendingPage";
import ProtectedRouteRoles from "@/layouts/ProtectedRouteRoles";
import { firestore } from "@/lib/firebase";
import { useUserStore } from "@/lib/hooks/useUserStore";
import { IUser } from "@/lib/types";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useCallback, useEffect } from "react";
import { RoleSelect } from "./RoleSelect";

export default function Users() {
  const { users, setUsers, pendingUsers, setPendingUsers } = useUserStore();

  const getData = useCallback(async () => {
    try {
      setPendingUsers(true);

      const q = query(collection(firestore, "users"));
      const querySnapshot = await getDocs(q);
      const filteredData = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setUsers(filteredData as IUser[]);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setPendingUsers(false);
    }
  }, [setPendingUsers, setUsers]);

  useEffect(() => {
    getData();
  }, [getData]);

  let content;

  if (pendingUsers) {
    content = <PendingPage />;
  } else {
    if (users.length > 0) {
      content = (
        <div className="grid grid-cols-1 gap-1">
          {users.map((user) => (
            <div key={user.id} className="border py-1 px-2 bg-card rounded flex items-center justify-between">
              <div>
                <p>{user.name}</p>
                <p>{user.email}</p>
              </div>
              <div>
                {user.role === "superadmin" ? (
                  <span className="font-bold text-muted-foreground capitalize">{user.role}</span>
                ) : (
                  <RoleSelect userId={user.id} currentRole={user.role} />
                )}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      content = <p>No users found</p>;
    }
  }

  return (
    <ProtectedRouteRoles authorizedRoles={["admin", "superadmin"]}>
      <section>
        <div className="container">
          <div className="max-w-lg">
            <h1 className="h1">Users</h1>
            {content}
          </div>
        </div>
      </section>
    </ProtectedRouteRoles>
  );
}
