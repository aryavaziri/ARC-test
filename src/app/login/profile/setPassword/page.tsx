"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { passwordSetSchema, TPassInput } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { setPassword } from "@/actions/auth";
import Input from "@/components/UI/Input3";
import { toast } from "react-toastify";
import { useAuth } from "@/store/hooks/authHooks";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/store/hooks/reduxHooks";

const SetPasswordPage = () => {
  const searchParams = useSearchParams();
  const { userData } = useAppSelector((state: RootState) => state.user);
  const router = useRouter();
  // const verificationToken = searchParams.get("token"); // Extract verificationToken
  // const userId = searchParams.get("userId"); // Extract userId

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TPassInput>({
    resolver: zodResolver(passwordSetSchema),
    defaultValues: {
      email: userData?.email || undefined,
      // id: userId || undefined,
      // verificationToken: verificationToken || "",
    },
  });

  // useEffect(() => {
  //   reset();
  // }, [userData]);
  useEffect(() => {
    reset();
  }, [searchParams, userData]);
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: TPassInput) => {
    const loadingToastId = toast.loading("Submitting ...");

    console.log(data);
    try {
      const result = await setPassword(data);
      console.log(result);
      if (result.success) {
        toast.update(loadingToastId, {
          render: "Password set, Logged in!!!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
        console.log("Success");
        router.push(`/dashboard`);
      } else {
        toast.update(loadingToastId, {
          render: "Error!! can not set password ",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
        setErrorMessage(result.error || "Failed to set password");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
    }
  };

  return (
    <div className="my-24 mgs flex items-center flex-col">
      <h1 className="text-4xl my-8">Set Your Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="min-w-[400px] flex flex-col gap-4">
        <Input name="email" type="email" register={register} error={errors.email} />
        <Input name="password" type="password" register={register} error={errors.password} />
        <Input label="Confirm Password" name="password2" type="password" register={register} error={errors.password2} />
        {errorMessage && <span className="text-red-500">{errorMessage}</span>}
        <button type="submit" className="btn btn-primary">
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default SetPasswordPage;
