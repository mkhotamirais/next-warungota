"use client";

import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { TUserRole } from "@/lib/types";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";
import { useUserStore } from "@/lib/hooks/useUserStore";

interface RoleSelectProps {
  userId: string;
  currentRole: TUserRole;
}

const roleOptions: TUserRole[] = ["admin", "editor", "user"];

export function RoleSelect({ userId, currentRole }: RoleSelectProps) {
  const { users, setUsers } = useUserStore();

  const handleChange = async (newRole: TUserRole) => {
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, { role: newRole });

      // Update lokal state Zustand
      const updated = users.map((user) => (user.id === userId ? { ...user, role: newRole } : user));
      setUsers(updated);

      toast.success("Role updated");
    } catch (error) {
      toast.error("Failed to update role");
      console.error(error);
    }
  };

  return (
    <Select value={currentRole} onValueChange={handleChange}>
      <SelectTrigger className="w-[140px] capitalize">{currentRole}</SelectTrigger>
      <SelectContent>
        {roleOptions.map((role) => (
          <SelectItem key={role} value={role} className="capitalize">
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
