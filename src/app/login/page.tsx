"use client"

import Link from "next/link";
import { usePasswordVisibility } from "../hooks/usePasswordVisibility";
import { HiddenPasswordEye, ShowPasswordEye } from "~/components/passwordIcons";



export default function LoginPage() {
    const { showPassword, toggleShowPassword, inputType } = usePasswordVisibility();

    return (
    <div className="flex h-[80vh] justify-center items-center overscroll-none">
        <fieldset className="fieldset flex flex-col bg-base-200 border-base-300 rounded-box w-lg border pl-15 pr-15 pb-15 pt-10 items-center justify-center">
            <label className="fieldset-legend text-lg">Login</label>

            <label className="label text-base">Username</label>
            <input type="text" className="input w-full" placeholder="Enter your username" />
            
            <label className="label text-base">Password</label>

            <div className="relative w-full">
                <input
                    type={inputType}
                    className="input w-full pr-10"
                    placeholder="Enter your password"
                />
                {showPassword ?
                <ShowPasswordEye toggleShowPassword={toggleShowPassword}/>
                :
                <HiddenPasswordEye toggleShowPassword={toggleShowPassword}/>

                }
            </div>

            <button className="btn mt-4">Submit</button>
            <div className="divider"></div>
            <Link className="text-base" href="/signup">Don&apos;t have an account? Sign up</Link>
        </fieldset>
    </div>
    );
}




