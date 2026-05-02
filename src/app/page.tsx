import Link from "next/link";
import { RecipeListCard } from "~/components/recipeListCard";


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



export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-wrap items-center justify-center">
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
