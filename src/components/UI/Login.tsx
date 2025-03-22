"use client";
import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiLoaderFill } from "react-icons/ri";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginInput, preRegisterSchema, signInSchema, TPreRegister } from "@/types/user";
import Input from "@/components/UI/Input3";
import { preRegister, resetPassword } from "@/actions/user";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import { IoClose } from "react-icons/io5";
import Link from "next/link";


const Login = () => {
  const [modalState, setModalState] = useState<"login" | "register" | "reset">("login"); // Managing login, register, and reset states
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loadinggggggg, setLoadinggggggg] = useState(false);

  // Form hooks for login
  const { register, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(signInSchema),
  });

  // Form hooks for register
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: formState2,
  } = useForm<TPreRegister>({
    resolver: zodResolver(preRegisterSchema),
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: formStateReset,
  } = useForm<{ email: string }>({
    resolver: zodResolver(signInSchema.pick({ email: true })), // Only validating email for reset password
  });

  const handleSignIn = async (payload: LoginInput) => {
    const loadingToastId = toast.loading("Logging in ...");
    try {
      setLoadinggggggg(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: payload.email,
        password: payload.password,
      });
      if (result?.error) {
        toast.update(loadingToastId, {
          render: `Error: ${result.error}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
        setError(`Error: ${result.error}`);
      } else {
        toast.update(loadingToastId, {
          render: "Logged in!!!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
        router.push("/dashboard");
      }
    } catch (error) {
      toast.update(loadingToastId, {
        render: (error as Error).message || "Error!!! Please try again",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
      console.error("An error occurred:", error);
    } finally {
      setLoadinggggggg(false);
    }
  };

  const handleRegister = async (payload: TPreRegister) => {
    setLoadinggggggg(true);
    console.log(payload);
    const loadingToastId = toast.loading("Loading...");
    try {
      // const res = { success: true, error: null };
      const res = await preRegister(payload);
      if (res.success) {
        toast.update(loadingToastId, {
          render: "Registeration was Successful. Our team will contact you as soon as possible.",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
      } else {
        throw new Error(res.error ?? undefined);
      }

    } catch (error) {
      toast.update(loadingToastId, {
        render: (error as Error).message || "Error!!! Please try again",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
      console.error("An error occurred:", error);
    }
    setLoadinggggggg(false);
  };

  // Handle reset password action
  const handleResetPassword = async ({ email }: { email: string }) => {
    setLoadinggggggg(true);
    const loadingToastId = toast.loading("Loading...");
    try {
      const res = await resetPassword(email);
      // const res = { success: true, error: null };
      if (res.success) {
        toast.update(loadingToastId, {
          render: "Please check your email to reset your password",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
      } else {
        throw new Error(res.error ?? undefined);
      }
    } catch (error) {
      toast.update(loadingToastId, {
        render: (error as Error).message || "Error!!! Please try again",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
      console.error("An error occurred:", error);
    } finally {
      setLoadinggggggg(false);
      // toast.dismiss(loadingToastId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (modalState) {
        case "reset":
          handleSubmitReset(handleResetPassword)();
          break;
        case "register":
          handleSubmit2(handleRegister)();
          break;
        default:
          handleSubmit(handleSignIn)();
          break;
      }
    }
  };

  return (
    <>
      <div
        className={`p-8 pb-20 h-full bg-linear-160 from-secondary/[0.15] to-primary/10 200 drop-shadow-lg flex flex-col items-center text-dark`}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        <div className={`flex items-center my-8 justify-between w-full`}>
          <div className={` sticky flex z-[100]`}>
            <Link href={`/`} className="flex items-center">
              <Image
                className={`object-contain w-[200px]`}
                width={200}
                height={0}
                alt="LOGO"
                src={`/next.svg`}
              />
            </Link>
          </div>
        </div>

        <div className={`w-full my-4 flex flex-col gap-2`}>
          <h4 className={`font-semibold`}>{modalState === "reset" ? `Reset Password` : modalState === "register" ? `Register` : `Log in`}</h4>
        </div>

        <div className={`flex w-full mb-8 gap-4 flex-col rounded-lg`}>
          {modalState === "reset" ? (
            <>
              <Input onKeyDown={handleKeyDown} name={"email"} register={registerReset} error={formStateReset.errors.email} type="email" />
              <button onClick={handleSubmitReset(handleResetPassword)} className={`btn btn-primary mt-8`}>
                {loadinggggggg ? <RiLoaderFill className={`animate-spin h-8`} /> : <div>Send Reset Link</div>}
              </button>
            </>
          ) : modalState === "register" ? (
            <>
              <Input onKeyDown={handleKeyDown} name={"email"} register={register2} error={formState2.errors.email} type="email" />
              <Input onKeyDown={handleKeyDown} name={"firstName"} register={register2} error={formState2.errors.firstName} />
              <Input onKeyDown={handleKeyDown} name={"lastName"} register={register2} error={formState2.errors.lastName} />
              <button onClick={handleSubmit2(handleRegister)} className={`btn btn-primary mt-8`}>
                {loadinggggggg ? <RiLoaderFill className={`animate-spin h-8`} /> : <div>REGISTER</div>}
              </button>
            </>
          ) : (
            <>
              <Input onKeyDown={handleKeyDown} name={"email"} register={register} error={formState.errors.email} type="email" />
              <Input onKeyDown={handleKeyDown} name={"password"} register={register} error={formState.errors.password} type="password" />
              <div className={`flex justify-between items-center`}>
                {
                  <button className={`text-sm underline font-normal mb-2 text-sky-800 cursor-pointer hover:font-semibold`} onClick={() => setModalState("reset")}>
                    Forget Password?
                  </button>
                }
              </div>
              <button onClick={handleSubmit(handleSignIn)} className={`btn btn-primary mt-8`}>
                {loadinggggggg ? <RiLoaderFill className={`animate-spin h-8`} /> : <div>SIGN IN</div>}
              </button>
            </>
          )}
        </div>

        <div className="flex justify-center mt-4">
          {modalState === "reset" ? (
            <p>
              <button className="text-sky-600 cursor-pointer hover:scale-[1.05]" onClick={() => setModalState("login")}>
                Back to Log In
              </button>
            </p>
          ) : modalState === "register" ? (
            <p>
              Already have an Account?{" "}
              <button className="text-sky-600 cursor-pointer hover:scale-[1.05]" onClick={() => setModalState("login")}>
                Log In
              </button>
            </p>
          ) : (
            <p>
              Do not Have an Account?{" "}
              <button className="text-sky-600 cursor-pointer hover:scale-[1.05]" onClick={() => setModalState("register")}>
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
