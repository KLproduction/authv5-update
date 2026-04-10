"use client";

import { login } from "@/actions/login";
import { auth } from "@/auth";
import { LoginSchema } from "@/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  parseAsBoolean,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { signOutAction } from "@/actions/signOut";

export const useGetCurrentUser = () => {
  const session = useSession();
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["current"],
    queryFn: () => {
      if (!session) {
        throw new Error("No session found");
      }
      return session;
    },
  });

  if (isLoading) {
    console.log("Fetching user data...");
  }

  if (isError) {
    console.error("Error fetching user:", error);
  }
  //   console.log("HOOK", user?.data);
  return user?.data?.user;
};

export const useSignInModel = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "sign-in-modal",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  return {
    open,
    close,
    isOpen,
    setIsOpen,
  };
};

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
