"use client"

import { useState } from "react";
import { addBookmark } from "~/server/repository/recipe";

export function BookmarkButton(props: {
    isBookmarked: boolean,
    recipeId: number
}) {

    const [isBookmarked, setIsBookmarked] = useState(props.isBookmarked);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleBookmarkChange = async () => {
        setIsButtonDisabled(true);
        try {
            await addBookmark(props.recipeId);
            setIsBookmarked(!isBookmarked);
        } finally {

        }
        

        setIsButtonDisabled(false);
    }

    return (
        <button className="btn" onClick={handleBookmarkChange} disabled={isButtonDisabled}>
            {isBookmarked ?
            "Remove from Bookmarks" :
            "Add to Bookmarks"}
        </button>
    )


} 