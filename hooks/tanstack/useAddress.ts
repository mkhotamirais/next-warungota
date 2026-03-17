import { addressSchema } from "@/lib/schemas/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";

interface Props {
  page?: number;
  limit?: number;
}

type inferAddress = z.infer<typeof addressSchema>;

export const useAddress = ({ page, limit }: Props = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["addresses", page, limit],
    queryFn: async () => {
      const res = await fetch(`/api/account/address`);
      const result = await res.json();
      return result;
    },
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: async (data: inferAddress) => {
      const res = await fetch("/api/account/address", { method: "POST", body: JSON.stringify(data) });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: inferAddress }) => {
      const res = await fetch(`/api/account/address/${id}`, { method: "PUT", body: JSON.stringify(data) });
      const result = await res.json();
      return result;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["address", variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/account/address/${id}`, { method: "DELETE" });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  return {
    ...query,
    createAddress: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAddress: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteAddress: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

export const useAddressDetail = (id: string) => {
  return useQuery({
    queryKey: ["address", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/account/address/${id}`);
      if (!res.ok) throw new Error("Alamat tidak ditemukan");
      return res.json();
    },
    enabled: !!id,
  });
};
