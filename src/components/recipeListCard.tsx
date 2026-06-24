export function RecipeListCard(props: {
  image_url: string;
  recipe_title: string;
}) {
  return (
    <div className="card bg-base-300 mx-4 my-2 h-96 w-96 shadow-sm">
      <figure className="m-auto h-60 w-60 overflow-hidden p-4">
        <img
          src={props.image_url}
          alt={props.recipe_title}
          className="h-full w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title m-auto">{props.recipe_title}</h2>
        <p className="line-clamp-3 overflow-hidden text-center wrap-break-word">
          A card component has a figure, a body part, and inside body there are
          title and actions parts
        </p>
      </div>
    </div>
  );
}
