import { useState } from "react";

export function usePasswordVisibility() {
    const [showPassword, setShowPassword] = useState(false);

    function toggleShowPassword() {
        setShowPassword(!showPassword);
    }

    return {
        showPassword,
        toggleShowPassword,
        inputType: showPassword ? "text" : "password"
    }
}