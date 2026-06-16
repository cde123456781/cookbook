"use client"

import Link from "next/link";
import { RecipeListCard } from "~/components/recipeListCard";
import { authClient } from "~/lib/auth-client";


const mockUrls = [
  "https://placehold.net/default.png",
  "https://placehold.net/default.png",
  "https://placehold.net/default.png",
  "https://placehold.net/default.png",
  "https://placehold.net/600x800.png",
  "https://placehold.net/600x800.png",
  "https://placehold.net/600x800.png"
];

const MockImages = mockUrls.map((url, index) => ({
  url: url,
  key: index
}));



export default function MyRecipesPage() {

  const { 
      data: session, 
      isPending, //loading state
      error, //error object
      refetch //refetch the session
  } = authClient.useSession() 

  if (isPending) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!session) {
    return (
    <div className="flex h-[80vh] items-center justify-center">
        <p className="text-gray-500">Please <Link href="/login">login</Link> to view your recipes</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <SearchBar/>
      <div className="flex flex-wrap items-center justify-center pt-10">
        {
          MockImages.map((image) => (
            /*
            <div key={image.key} className="flex justify-center items-center w-48 h-48">
              <img src={image.url} alt="image" className="object-contain h-[150px] w-[150px]"/>
            </div>
            */
            <RecipeListCard image_url={image.url} recipe_title="Test Title" key={image.key}/>

          ))
        }
      </div>
    </main>
  );
}


function SearchBar() {
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-m border p-4 m-auto flex gap-8">
      <legend className="fieldset-legend">Search Recipes</legend>
      <div className="">
        <label className="label">Title</label>
        <input type="text" className="input" placeholder="" />
      </div>
      

      <div className="">
        <label className="label">Category</label>
        <input type="text" className="input" placeholder="" />
      </div>
    </fieldset>

  );
}
