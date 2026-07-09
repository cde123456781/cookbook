"use client"

import { useState } from "react";
import { setRecipePrivacy } from "~/server/repository/recipe";

export function PrivateButton(props: {
    isPublic: boolean,
    recipeId: number
}) {

    const [isPublic, setIsPublic] = useState(props.isPublic);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handlePrivacyChange = async () => {
        setIsButtonDisabled(true);
        try {
            await setRecipePrivacy(props.recipeId, !isPublic);
            setIsPublic(!isPublic);
        } finally {

        }
        

        setIsButtonDisabled(false);
    }

    return (
        <button onClick={handlePrivacyChange} disabled={isButtonDisabled}>
            {isPublic ?
            "Set private" :
            "Set public"}
        </button>
    )


} 