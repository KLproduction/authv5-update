"use client";

import { CardWapper } from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("id");
  const [error, setError] = useState<string | undefined>();
  const [success, setSucces] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Missing Token");
      return;
    }
    newVerification(token, userId!)
      .then((data) => {
        setSucces("");
        setError("");
        setSucces(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, userId, success, error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSubmit();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onSubmit]);

  return (
    <CardWapper
      headerLabel="Confirming your email"
      backBtnHref="/auth/login"
      backBtnLabel="Back to login"
    >
      <div className="flex min-h-[140px] w-full flex-col items-center justify-center gap-5 text-center">
        {!success && !error && <BeatLoader />}

        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWapper>
  );
};

export default NewVerificationForm;
