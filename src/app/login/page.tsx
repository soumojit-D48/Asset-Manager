import LoginButton from "@/components/auth/login-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Package } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";


async function LoginPage() {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(session) redirect('/')

    return ( 
        <div className="flex min-h-screen items-center justify-center bg-slate-100 ">
            <Card className="w-full max-w-md shadow">
                <CardHeader className="text-center">
                    <div className="mx-auto p-2.5 rounded-full bg-blue-500 w-fit">
                        <Package className="h-6 w-6 text-white"/>
                    </div>
                    <CardTitle className="text-2xl font-bold text-blue-600">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                        Sign In to your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {/* login button component */}
                    <LoginButton/>

                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href='/' className="text-sm text-slate-500 hover:text-stone-600">
                        Back to home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}

export default LoginPage;