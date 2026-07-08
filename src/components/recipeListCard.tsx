import Link from "next/link";

export function RecipeListCard(props: {
  image_url: string;
  recipe_title: string;
  description: string | null;
  id: number;
}) {
  return (
    <Link href={"/recipes/" + props.id.toString()}>
      <div className="card bg-base-300 mx-4 my-2 h-96 w-96 shadow-sm hover:bg-base-200">
        <figure className="m-auto h-60 w-60 overflow-hidden p-4">
          { props.image_url != "" ?
          <img
            src={props.image_url}
            alt={props.recipe_title}
            className="h-full w-full object-cover"
          />

          :

          <img
            src="https://placehold.net/default.png"
            alt={props.recipe_title}
            className="h-full w-full object-cover"
          />

          }
          
          
    
        </figure>
        <div className="card-body">
          <h2 className="card-title m-auto">{props.recipe_title}</h2>
          <p className="line-clamp-3 overflow-hidden text-center wrap-break-word">
            {props.description ?? "No description found"}
          </p>
        </div>
      </div>
    </Link>
  );
}
