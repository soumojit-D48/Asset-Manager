import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function GallaryPage() { // this will be a public page for user not for admin

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(session && session?.user?.role === 'admin') { // cant access the gallary page for admin
        redirect('/')
    }

    return ( 
        <div>Gallary Page</div>
    );
}

export default GallaryPage;