'use client'

import { Button } from "../ui/button";

function LoginButton() {
    return ( 
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-base font-medium">
            <span>
                Sign In with Google
            </span>
        </Button>

    );
}

export default LoginButton;