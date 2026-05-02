export function RecipeListCard(props: {image_url: string, recipe_title: string}) {
    return (
        <div className="card bg-base-200 w-96 shadow-sm mx-4 my-2">
            <figure className="p-4 h-60 w-60 overflow-hidden m-auto">
                <img
                src={props.image_url}
                alt={props.recipe_title} 
                className="object-cover h-full w-full"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title m-auto">{props.recipe_title}</h2>
                <p className="text-center">A card component has a figure, a body part, and inside body there are title and actions parts</p>
            </div>
        </div>
    );
}