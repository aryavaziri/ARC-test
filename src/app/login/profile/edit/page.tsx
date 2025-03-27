"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TUser, userSchema } from "@/types/user";
import { useAuth } from "@/store/hooks/authHooks";
import Input from "@/components/UI/Input";
import Link from "next/link";

const Page = () => {
  const { userData, update } = useAuth();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>(userData?.profileImg || "/Images/default_user.jpg");

  const { register, handleSubmit, reset, formState } = useForm<TUser>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    let userProfileImage;
    if (userData) {
      reset({
        id: userData.id,
        email: userData.email || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
      });
      setPreviewImageUrl(userProfileImage || "/Images/default_user.jpg");
      setSelectedImageFile(null);
    }
  }, [userData, reset]);


  const onSubmit = async (data: TUser & { id: string }) => {
    console.log(data);
    if (data?.id) {
      try {
        if (selectedImageFile) {
          const allowedTypes = ["image/heic", "image/jpeg", "image/jpg", "image/png"];
        } else if (userData?.profileImg && previewImageUrl === "/Images/default_user.jpg" && userData?.profileImg !== "/Images/default_user.jpg") {
          data.profileImg = "/Images/default_user.jpg";
        } else {
          data.profileImg = userData?.profileImg ?? undefined;
        }
        await update(data);
      } catch (error) {
        console.error("Failed to update profile.", error);
      }
    }
  };

  return (
    <div className="con flex gap-8 w-[400px] mt-[12vh] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 h-full w-full">
        <Input style={3} name="email" label="Email" type="email" register={register} error={formState.errors.email} placeholder="Enter your email" disabled />
        <Input style={3} name="firstName" label="First Name" register={register} error={formState.errors.firstName} placeholder="Enter your first name" />
        <Input style={3} name="lastName" label="Last Name" register={register} error={formState.errors.lastName} placeholder="Enter your last name" />
        <div className={`flex gap-4 mt-12`}>
          <Link className={`btn btn-primary mx-auto w-fit`} href={`setPassword/`}>
            Reset Password
          </Link>
          {/* <button type="button" onClick={handleReset} className={`btn btn-primary mx-auto w-fit`}>
            Reset Password
          </button> */}
          <button type="submit" className={`btn btn-primary mx-auto w-fit`}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
