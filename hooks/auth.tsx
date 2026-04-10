"use client";

import { signOutAction } from "@/actions/signOut";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: signOutMutate } = useMutation({
    mutationFn: async () => {
      await signOutAction();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current"] });
      router.refresh();
    },
  });

  return { signOutMutate };
};
