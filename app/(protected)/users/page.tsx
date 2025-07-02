"use client";

import { firestore } from "@/lib/firebase";
import { useFirebaseUserStore } from "@/lib/firebaseUsersStore";
import { IUser } from "@/lib/types";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useCallback, useEffect } from "react";

export default function Users() {
  const { users, setUsers, pending, setPending } = useFirebaseUserStore();

  const getData = useCallback(async () => {
    try {
      setPending(true);

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
      setPending(false);
    }
  }, [setPending, setUsers]);

  useEffect(() => {
    getData();
  }, [getData]);

  let content;

  if (pending) {
    content = <p>Loading...</p>;
  } else {
    if (users.length > 0) {
      content = (
        <div className="grid grid-cols-1 gap-2">
          {users.map((user) => (
            <div key={user.id} className="border">
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.role}</p>
            </div>
          ))}
        </div>
      );
    } else {
      content = <p>No users found</p>;
    }
  }

  return (
    <section>
      <div className="container">
        <h1 className="h1">Users</h1>
        {content}
      </div>
    </section>
  );
}
