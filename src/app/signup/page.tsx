"use client";

import Link from "next/link";
import { usePasswordVisibility } from "../hooks/usePasswordVisibility";
import { HiddenPasswordEye, ShowPasswordEye } from "~/components/passwordIcons";
import { useEffect, useState } from "react";
import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
import { SignUpValidator } from "../validators/signUpValidator";

export default function SignUpPage() {
  const { showPassword, toggleShowPassword, inputType } =
    usePasswordVisibility();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [signUpError, setSignUpError] = useState("");

  const router = useRouter();

  const signUp = async () => {
    const validationResult = SignUpValidator.safeParse({
      username,
      email,
      password,
    });
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0] ?? "",
        email: fieldErrors.email?.[0] ?? "",
        password: fieldErrors.password?.[0] ?? "",
      });
    } else {
      await authClient.signUp.email(
        {
          email: email,
          password: password,
          name: "",
          username: username,
        },
        {
          onRequest: () => {
            setSubmitDisabled(true);
          },
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            setSignUpError(ctx.error.message);
            setSubmitDisabled(false);
          },
        },
      );
    }
  };

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace("/"); // or push
    }
  }, [session, router]);

  if (isPending) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="m-5 flex min-h-[calc(100vh-64px-40px)] items-stretch justify-center">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box flex w-lg flex-col items-center justify-center border pt-10 pr-15 pb-15 pl-15">
        <label className="fieldset-legend text-lg">Sign Up</label>

        <label className="label mt-5 text-base">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input w-full"
          placeholder="Enter your email"
        />
        <p className="label text-error text-sm">{errors.email || "\u00A0"}</p>

        <label className="label text-base">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input w-full"
          placeholder="Enter your username"
        />
        <p className="label text-error justify-center text-sm">
          {errors.username ? errors.username : "\u00A0"}
        </p>

        <label className="label text-base">Password</label>

        <div className="relative w-full">
          <input
            type={inputType}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full pr-10"
            placeholder="Enter your password"
          />
          {showPassword ? (
            <ShowPasswordEye toggleShowPassword={toggleShowPassword} />
          ) : (
            <HiddenPasswordEye toggleShowPassword={toggleShowPassword} />
          )}
        </div>
        <p className="label text-error text-sm">
          {errors.password || "\u00A0"}
        </p>

        <p className="label text-error m-2 justify-center text-sm">
          {signUpError ? signUpError : "\u00A0"}
        </p>
        <button className="btn mt-4" disabled={submitDisabled} onClick={signUp}>
          Submit
        </button>
        <div className="divider"></div>
        <Link className="text-base" href="/login">
          Already have an account? Login
        </Link>
      </fieldset>
    </div>
  );
}
