'use client'

import { signIn } from "@/lib/auth-client";
import { Button } from "../ui/button";

function LoginButton() {
    const handleLogin = async() => {
        await signIn.social({
            provider: 'google', 
            callbackURL: '/'
        })
    }

    // const handleLogin = async () => {
    //     await signIn("google", {
    //         callbackURL: "/"
    //     })
    // }

     




    return (
        <Button onClick={handleLogin} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-base font-medium">
            <span>
                Sign In with Google
            </span>
        </Button>

    );
}

export default LoginButton;