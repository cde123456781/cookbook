"use client"

import Link from "next/link";
import { authClient } from "~/lib/auth-client";
import { SearchBar } from "./searchbar";
import type { RecipeQueryResult } from "~/app/types/recipe";
import { RecipeListCard } from "./recipeListCard";
import { useEffect, useState } from "react";
import type { MultiValue } from "react-select";
import { usePathname } from "next/navigation";

export function RecipeCollection(props:{
    recipes: RecipeQueryResult[],
    categories: {
        id: number;
        name: string;
    }[]
}) {

    const [titleInput, setTitleInput] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<{categoryId: number}[]>([]);
    const [displayRecipes, setDisplayRecipes] = useState(props.recipes);

    const categoryOptions = props.categories.map((category) => ({
        value: category.id,
        label: category.name,
    }));
    const pathname = usePathname();


    const updateTitleInput = (newValue: string) => {
        setTitleInput(newValue);
    }



    const handleCategoryChange = (newValue: MultiValue<{ value: number; label: string; }>) => {
        const values = Array.from(newValue, (option) =>
            Number(option.value),
        );

        setSelectedCategories(values.map((id) => ({categoryId: id})));
    }


    useEffect(() => {
        setDisplayRecipes(
            props.recipes.filter((recipe) => {
                const hasCategories = selectedCategories.every((category) =>
                    recipe.categories.some(
                    (recipeCategory) =>
                        recipeCategory.categoryId === category.categoryId
                    )
                );

                const matchesTitle = recipe.title
                    .toLowerCase()
                    .includes(titleInput.toLowerCase());

                return hasCategories && matchesTitle;
            })
        )
    
    }, [selectedCategories, titleInput]);
  

    
            
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-row justify-center items-center">
                <SearchBar 
                    titleInput={titleInput} 
                    onTitleChange={updateTitleInput} 
                    categoryOptions={categoryOptions} 
                    selectedCategories={selectedCategories} 
                    handleSelectedCategories={handleCategoryChange}
                /> 
                {pathname == "/myrecipes" &&
                    <Link href="/myrecipes/add"><button className="btn ml-5">Add Recipe</button></Link>
                }
            </div>
            <div className="flex flex-wrap items-center justify-center pt-10">
                {displayRecipes.map((recipe) => (
                <RecipeListCard
                    image_url={recipe.recipeImage ? recipe.recipeImage.url : ""}
                    recipe_title={recipe.title}
                    description={recipe.description}
                    id={recipe.id}
                    key={recipe.id}
                />
                ))}

                {displayRecipes.length == 0 && 
                <div className="flex h-[80vh] justify-center">
                    <p className="text-gray-500">
                    No recipes could be found
                    </p>
                </div>
                }
            </div>
        </div>


    );
    
}