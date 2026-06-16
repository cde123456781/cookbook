"use client"

import Link from "next/link";
import { RecipeListCard } from "~/components/recipeListCard";
import { authClient } from "~/lib/auth-client";


export default function HomePage() {

  const { 
      data: session, 
      isPending, //loading state
      error, //error object
      refetch //refetch the session
  } = authClient.useSession() 

  return (
    <div className="min-h-[calc(100vh-64px-40px)] flex items-stretch justify-center rounded-xl bg-gray-100 m-5 p-4">
      <div className=" w-full bg-top-right sm:bg-center flex flex-col justify-center  bg-[url(https://g64sitr9ro.ufs.sh/f/lfeZeTbNwGK9v99pY4fueWY4cHnF6gtuwi1UrsE03Afm5JzZ)] bg-gray-100 shadow-lg overflow-hidden">
        <div className="sm:ml-10 flex flex-col items-start gap-6 ml-auto mr-auto">
          <div className="bg-base-100 w-fit sm:p-10 p-5 rounded-xl ">
            <h1 className="sm:text-4xl  text-2xl font-bold">Your Cookbook</h1>
            <h2 className="sm:text-xl  text-xl font-medium opacity-70 mt-2">All your recipes in one place</h2>
          </div>
          
          { session? 
            <div className="flex sm:flex-row flex-col gap-4 ml-auto mr-auto">
              <Link href="/myrecipes" className="btn bg-base-100 text-xl font-medium rounded-xl">View my Recipes</Link>
            </div>
            :
            <div className="flex sm:flex-row flex-col gap-4 ml-auto mr-auto">
              <Link href="/login" className="btn bg-base-100 text-xl font-medium rounded-xl">Login</Link>
              <Link href="/signup" className="btn bg-base-100 text-xl font-medium rounded-xl">Sign Up</Link>
            </div>

            }
            

        </div>
      </div>
    </div>
  );
}

