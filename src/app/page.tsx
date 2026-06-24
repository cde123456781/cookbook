"use client";

import Link from "next/link";
import { RecipeListCard } from "~/components/recipeListCard";
import { authClient } from "~/lib/auth-client";

export default function HomePage() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  return (
    <div className="m-5 flex min-h-[calc(100vh-64px-40px)] items-stretch justify-center rounded-xl bg-gray-100 p-4">
      <div className="flex w-full flex-col justify-center overflow-hidden bg-gray-100 bg-[url(https://g64sitr9ro.ufs.sh/f/lfeZeTbNwGK9v99pY4fueWY4cHnF6gtuwi1UrsE03Afm5JzZ)] bg-top-right shadow-lg sm:bg-center">
        <div className="mr-auto ml-auto flex flex-col items-start gap-6 sm:ml-10">
          <div className="bg-base-100 w-fit rounded-xl p-5 sm:p-10">
            <h1 className="text-2xl font-bold sm:text-4xl">Your Cookbook</h1>
            <h2 className="mt-2 text-xl font-medium opacity-70 sm:text-xl">
              All your recipes in one place
            </h2>
          </div>

          {session ? (
            <div className="mr-auto ml-auto flex flex-col gap-4 sm:flex-row">
              <Link
                href="/myrecipes"
                className="btn bg-base-100 rounded-xl text-xl font-medium"
              >
                View my Recipes
              </Link>
            </div>
          ) : (
            <div className="mr-auto ml-auto flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="btn bg-base-100 rounded-xl text-xl font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="btn bg-base-100 rounded-xl text-xl font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
